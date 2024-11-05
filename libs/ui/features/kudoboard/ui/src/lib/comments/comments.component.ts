import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import {
  selectKudoBoardById,
  selectKudoBoardCommentsById,
  FeatKudoBoardCommentActions,
} from '@kitouch/data-kudoboard';

import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import {
  AccountTileComponent,
  DividerComponent,
  UIKitCommentAreaComponent,
  UiKitDeleteComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { APP_PATH, AuthorizedFeatureDirective } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import { filter, map, of, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-comments',
  templateUrl: './comments.component.html',
  imports: [
    //
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UIKitCommentAreaComponent,
    UiKitTweetButtonComponent,
    AccountTileComponent,
    AuthorizedFeatureDirective,
    DividerComponent,
    UiKitDeleteComponent,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardCommentsComponent {
  kudoboardId = input.required<string>();

  #store = inject(Store);
  kudoboardId$ = toObservable(this.kudoboardId);

  kudoboard$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardById(kudoboardId)))
    )
  );

  kudoboardProfile = toSignal(
    this.kudoboard$.pipe(
      filter(Boolean),
      switchMap(({ profile }) =>
        profile
          ? this.#store.pipe(
              select(selectProfileById(profile.id)),
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

  placeholder = computed(() => {
    const profileName = this.kudoboardProfile()?.name;

    if (profileName) {
      return (
        'Support ' + this.kudoboardProfile()?.name + ' or leave your thoughts'
      );
    }

    return 'Add your kudo!';
  });

  profilePictureFn = profilePicture;
  currentProfile = this.#store.selectSignal(selectCurrentProfile);
  currentProfilePic = computed(() =>
    this.profilePictureFn(this.currentProfile())
  );

  profileUrl = `/${APP_PATH.Profile}/`;

  commentHandler(content: string) {
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
}
