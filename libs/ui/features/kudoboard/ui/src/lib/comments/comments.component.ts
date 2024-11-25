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
import { ReactiveFormsModule } from '@angular/forms';
import {
  AuthorizedFeatureDirective,
  SharedKitUserHintDirective,
} from '@kitouch/containers';
import {
  FeatKudoBoardCommentActions,
  selectKudoBoardById,
  selectKudoBoardCommentsById,
} from '@kitouch/data-kudoboard';

import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { DeviceService } from '@kitouch/shared-infra';
import { KudoBoardComment } from '@kitouch/shared-models';
import { MasonryService } from '@kitouch/shared-services';
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
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import {
  delay,
  filter,
  map,
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
  #actions = inject(Actions);
  #store = inject(Store);
  #deviceService = inject(DeviceService);
  #masonryService = inject(MasonryService);

  #createdComment$ = this.#actions.pipe(
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
      comments.sort(
        (a, b) =>
          b.timestamp.createdAt.getTime() - a.timestamp.createdAt.getTime()
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
  }

  commentHandler({ content }: AddComment) {
    const currentProfile = this.currentProfile();

    this.#store.dispatch(
      FeatKudoBoardCommentActions.postCommentKudoBoard({
        comment: {
          kudoBoardId: this.kudoboardId(),
          profileId: currentProfile?.id ?? null,
          profile: currentProfile,
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

  mediaType(mediaUrl: string) {
    return mediaUrl.split('.').reverse()[0];
  }

  mediaWidthRatio(height: number, width: number) {
    return width / height;
  }
}
