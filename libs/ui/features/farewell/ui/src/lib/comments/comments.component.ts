import {
  AsyncPipe,
  DatePipe,
  NgOptimizedImage,
  NgStyle,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorizedFeatureDirective } from '@kitouch/containers';
import {
  FeatFarewellCommentActions,
  selectFarewellById,
  selectFarewellCommentsById,
} from '@kitouch/feat-farewell-data';
import { getFullS3Url } from '@kitouch/feat-farewell-effects';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import {
  Auth0Service,
  S3_FAREWELL_BUCKET_BASE_URL,
} from '@kitouch/shared-infra';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import { PhotoService, sortByCreatedTimeDesc } from '@kitouch/shared-services';
import {
  AccountTileComponent,
  AddComment,
  DividerComponent,
  UIKitCommentAreaComponent,
  UiKitDeleteComponent,
} from '@kitouch/ui-components';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import PhotoSwipe from 'photoswipe';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-comments',
  templateUrl: './comments.component.html',
  imports: [
    //
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgStyle,
    NgOptimizedImage,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UIKitCommentAreaComponent,
    AccountTileComponent,
    AuthorizedFeatureDirective,
    DividerComponent,
    UiKitDeleteComponent,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellCommentsComponent {
  farewellId = input.required<string>();

  #actions$ = inject(Actions);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);
  #photoService = inject(PhotoService);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  farewellId$ = toObservable(this.farewellId);

  farewell$ = this.farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellById(farewellId)))
    )
  );
  farewellProfile = toSignal(
    this.farewell$.pipe(
      filter(Boolean),
      switchMap(({ profile, profileId }) =>
        this.#store.pipe(
          select(selectProfileById(profileId)),
          map((resolvedProfile) => resolvedProfile ?? profile)
        )
      )
    )
  );

  farewellComments$ = this.farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellCommentsById(farewellId)))
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

  placeholder = computed(() => {
    const profileName = this.farewellProfile()?.name;
    if (profileName) {
      return (
        'Support ' + this.farewellProfile()?.name + ' or leave your thoughts'
      );
    }

    return 'Leave your thoughts';
  });

  profilePictureFn = profilePicture;
  currentProfile = this.#store.selectSignal(selectCurrentProfile);
  currentProfilePic = computed(() =>
    this.profilePictureFn(this.currentProfile())
  );

  profileUrl = `/${APP_PATH.Profile}/`;

  constructor() {
    this.farewellComments$
      .pipe(
        takeUntilDestroyed(),
        filter((comments) => comments.length > 0),
        take(1),
        // so comments can be rendered
        delay(100),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.#photoService.initializeGallery({
          gallery: '#uploaded-comment-media-gallery',
          children: 'a',
          pswpModule: PhotoSwipe,
        });
      });
  }

  uploadCommentMediaFiles(): (
    images: Array<File>
  ) => Observable<Array<ContractUploadedMedia>> {
    const getFarewellId = () => this.farewellId();
    const getProfileId = () => this.currentProfile()?.id;

    return (images: Array<File>) => {
      const profileId = getProfileId() ?? 'anonymous',
        farewellId = getFarewellId();

      const mediaFiles = images;

      if (!farewellId) {
        console.error(
          '[saveImages] cannot upload images by unknown profile and farewell',
          profileId,
          farewellId
        );
        return of([]);
      }

      setTimeout(() => {
        const now = new Date();
        this.#store.dispatch(
          FeatFarewellCommentActions.uploadFarewellCommentStorageMedia({
            farewellId,
            profileId,
            items: mediaFiles.map((mediaFile) => ({
              key: `${farewellId}/comments/${profileId}/${now.getTime()}-${
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
          FeatFarewellCommentActions.uploadFarewellCommentStorageMediaSuccess
        ),
        // AWS S3 bucket has eventual consistency so need a time for it to be available
        delay(1500),
        map(({ items }) =>
          items.map((item) => ({
            ...item,
            url: getFullS3Url(this.#s3FarewellBaseUrl, item.url),
            optimizedUrls: item.optimizedUrls.map((optimizedUrl) =>
              getFullS3Url(this.#s3FarewellBaseUrl, optimizedUrl)
            ),
          }))
        )
      );
    };
  }

  deleteCommentMedia() {
    return (url: string) => {
      this.#store.dispatch(
        FeatFarewellCommentActions.deleteFarewellCommentStorageMedia({
          url,
        })
      );
      // TODO add error handling
    };
  }

  commentHandler({ content, medias }: AddComment) {
    const currentProfile = this.currentProfile();
    this.#store.dispatch(
      FeatFarewellCommentActions.postCommentFarewell({
        comment: {
          farewellId: this.farewellId(),
          profileId: currentProfile?.id ?? null,
          profile: currentProfile,
          content,
          medias,
        },
      })
    );
  }

  deleteHandler(commentId: string) {
    this.#store.dispatch(
      FeatFarewellCommentActions.deleteCommentFarewell({
        id: commentId,
      })
    );
  }

  mediaType(mediaUrl: string) {
    return mediaUrl.split('.').reverse()[0];
  }

  mediaWidthRatio(height: number, width: number) {
    return width / height;
  }

  signIn() {
    this.#auth0Service.signInTab();
  }
}
