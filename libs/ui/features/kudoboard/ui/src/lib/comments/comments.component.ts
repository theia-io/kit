import {
  AsyncPipe,
  DatePipe,
  NgOptimizedImage,
  NgStyle,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  AuthorizedFeatureDirective,
  SharedKitUserHintDirective,
} from '@kitouch/containers';
import {
  FeatKudoBoardCommentActions,
  selectKudoBoardById,
  selectKudoBoardCommentsById,
} from '@kitouch/data-kudoboard';
import { getFullS3Url } from '@kitouch/effects-kudoboard';

import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import {
  DeviceService,
  S3_KUDOBOARD_BUCKET_BASE_URL,
} from '@kitouch/shared-infra';
import {
  ContractUploadedMedia,
  KudoBoardComment,
} from '@kitouch/shared-models';
import {
  MasonryService,
  PhotoService,
  sortByCreatedTimeDesc,
} from '@kitouch/shared-services';
import {
  AccountTileComponent,
  AddComment,
  DEFAULT_ANIMATE_TIMEOUT,
  DividerComponent,
  UIKitCommentAreaComponent,
  UiKitCompAnimatePingComponent,
  UiKitDeleteComponent,
} from '@kitouch/ui-components';

import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import Masonry from 'masonry-layout';
import PhotoSwipe from 'photoswipe';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import {
  delay,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-comments',
  templateUrl: './comments.component.html',
  imports: [
    //
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgStyle,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UiKitCompAnimatePingComponent,
    UIKitCommentAreaComponent,
    AccountTileComponent,
    AuthorizedFeatureDirective,
    DividerComponent,
    UiKitDeleteComponent,
    SharedKitUserHintDirective,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardCommentsComponent implements AfterViewInit {
  kudoboardId = input.required<string>();
  canComment = input(false);

  #destroyRef = inject(DestroyRef);
  #actions$ = inject(Actions);
  #store = inject(Store);
  #photoService = inject(PhotoService);
  #deviceService = inject(DeviceService);
  #masonryService = inject(MasonryService);
  #s3KudoBoardBaseUrl = inject(S3_KUDOBOARD_BUCKET_BASE_URL);

  #createdComment$ = this.#actions$.pipe(
    ofType(FeatKudoBoardCommentActions.postCommentKudoBoardSuccess),
    takeUntilDestroyed()
  );

  kudoboardId$ = toObservable(this.kudoboardId);

  kudoboard$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardById(kudoboardId)))
    )
  );

  kudoboardProfile = toSignal(
    this.kudoboard$.pipe(
      filter(Boolean),
      switchMap(({ profileId, profile }) =>
        profileId || profile
          ? this.#store.pipe(
              select(selectProfileById(profileId ?? profile?.id ?? '')),
              map((resolvedProfile) => resolvedProfile ?? profile)
            )
          : of(undefined)
      )
    )
  );

  kudoboardComments$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardCommentsById(kudoboardId)))
    ),
    map((comments) =>
      comments.sort((a, b) =>
        sortByCreatedTimeDesc(
          a.createdAt ?? (a as any).timestamp?.createdAt,
          b.createdAt ?? (b as any).timestamp?.createdAt
        )
      )
    )
  );

  $hintHidden = this.#deviceService.isMobile$.pipe(startWith(true));

  #masonryReadyTrigger$ = this.kudoboardComments$.pipe(
    takeUntilDestroyed(this.#destroyRef),
    filter((comments) => comments && comments.length > 0),
    delay(0),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  placeholder = computed(() => {
    return 'Add your kudo!';
  });

  profilePictureFn = profilePicture;
  currentProfile = this.#store.selectSignal(selectCurrentProfile);
  currentProfilePic = computed(() =>
    this.profilePictureFn(this.currentProfile())
  );

  profileUrl = `/${APP_PATH.Profile}/`;

  @ViewChild('commentsTmpl')
  commentsTmpl: ElementRef;
  #masonry?: Masonry;
  animatedCommentsSet = signal<Set<KudoBoardComment['id']>>(new Set());

  ngAfterViewInit(): void {
    const masonryWrapper = this.commentsTmpl.nativeElement;

    this.#masonryReadyTrigger$.pipe(take(1)).subscribe(() => {
      if (masonryWrapper) {
        this.#masonryService
          .initializeMasonry(masonryWrapper, {
            itemSelector: '.masonry-item',
          })
          .then((masonry) => (this.#masonry = masonry));
      }
    });

    this.#masonryReadyTrigger$.pipe(skip(1)).subscribe(() => {
      if (
        this.#masonry &&
        this.#masonry.reloadItems &&
        this.#masonry.layout &&
        this.#masonry.getItemElements &&
        this.#masonry.prepended
      ) {
        this.#masonry.reloadItems();
        this.#masonry.layout();
      }
    });

    this.#createdComment$.subscribe(({ comment }) => {
      this.animatedCommentsSet.update(
        (existingSet) => new Set([...existingSet.values(), comment.id])
      );

      setTimeout(() => {
        this.animatedCommentsSet.update(
          (existingSet) =>
            new Set([...existingSet.values()].filter((id) => id !== comment.id))
        );
      }, DEFAULT_ANIMATE_TIMEOUT);
    });

    this.kudoboardComments$
      .pipe(takeUntilDestroyed(this.#destroyRef), delay(1000))
      .subscribe(() =>
        this.#photoService.initializeGallery({
          gallery: '#kudo-posts-media-gallery',
          children: 'a',
          pswpModule: PhotoSwipe,
        })
      );
  }

  commentValidator() {
    return function (
      this: UIKitCommentAreaComponent,
      control: AbstractControl
    ): ValidationErrors | null {
      const value = control.value,
        uploadedMedias = this.uploadedMedias();

      const valueLength = value?.length;
      const lengthValidity = valueLength >= 2 && valueLength <= 1000;

      if (uploadedMedias.length > 0 && (!valueLength || valueLength <= 1000)) {
        return null;
      }

      if (lengthValidity) {
        return null;
      }

      return {
        error:
          'Field is required and hsa to be at least 2 and no more than 1000',
      };
    };
  }

  uploadCommentMediaFiles(): (
    images: Array<File>
  ) => Observable<Array<ContractUploadedMedia>> {
    const getKudoBoardId = () => this.kudoboardId();
    const getProfileId = () => this.currentProfile()?.id;

    return (images: Array<File>) => {
      const profileId = getProfileId() ?? 'anonymous',
        kudoBoardId = getKudoBoardId();

      const mediaFiles = images;

      if (!kudoBoardId) {
        console.error(
          '[saveImages] cannot upload images by unknown profile and KudoBoard',
          profileId,
          kudoBoardId
        );
        return of([]);
      }

      setTimeout(() => {
        const now = new Date();
        this.#store.dispatch(
          FeatKudoBoardCommentActions.uploadKudoBoardCommentStorageMedia({
            kudoBoardId,
            profileId,
            items: mediaFiles.map((mediaFile) => ({
              key: `${kudoBoardId}/comments/${profileId}/${now.getTime()}-${
                mediaFile.name
              }`,
              blob: mediaFile,
            })),
          })
        );
      });

      // TODO add error handling
      return this.#actions$.pipe(
        ofType(
          FeatKudoBoardCommentActions.uploadKudoBoardCommentStorageMediaSuccess
        ),
        take(1),
        // AWS S3 bucket has eventual consistency so need a time for it to be available
        delay(1500),
        map(({ items }) =>
          items.map((item) => ({
            ...item,
            url: getFullS3Url(this.#s3KudoBoardBaseUrl, item.url),
            optimizedUrls: item.optimizedUrls.map((optimizedUrl) =>
              getFullS3Url(this.#s3KudoBoardBaseUrl, optimizedUrl)
            ),
          }))
        )
      );
    };
  }

  deleteCommentMedia() {
    return (url: string) => {
      this.#store.dispatch(
        FeatKudoBoardCommentActions.deleteKudoBoardCommentStorageMedia({
          url,
        })
      );
      // TODO add error handling
    };
  }

  commentHandler({ content, medias }: AddComment) {
    const currentProfile = this.currentProfile();

    this.#store.dispatch(
      FeatKudoBoardCommentActions.postCommentKudoBoard({
        comment: {
          kudoBoardId: this.kudoboardId(),
          profileId: currentProfile?.id ?? null,
          profile: currentProfile,
          medias,
          content,
        },
      })
    );
  }

  deleteHandler(commentId: string) {
    this.#store.dispatch(
      FeatKudoBoardCommentActions.deleteCommentKudoBoard({
        id: commentId,
      })
    );
  }

  mediaWidth(width = 350) {
    return Math.min(width, 350);
  }

  mediaType(mediaUrl: string) {
    return mediaUrl.split('.').reverse()[0];
  }

  mediaWidthRatio(height: number, width: number) {
    return width / height;
  }
}
