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
  FeatFarewellCommentActions,
  selectFarewellById,
  selectFarewellCommentsById,
} from '@kitouch/feat-farewell-data';
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
import { filter, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-comments',
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
export class FeatFarewellCommentsComponent {
  farewellId = input.required<string>();

  #store = inject(Store);
  farewellId$ = toObservable(this.farewellId);

  farewell$ = this.farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellById(farewellId)))
    )
  );
  farewellProfile = toSignal(
    this.farewell$.pipe(
      filter(Boolean),
      switchMap(({ profile }) =>
        this.#store.pipe(
          select(selectProfileById(profile.id)),
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
      comments.sort(
        (a, b) =>
          b.timestamp.createdAt.getTime() - a.timestamp.createdAt.getTime()
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

  commentHandler(content: string) {
    const currentProfile = this.currentProfile();
    this.#store.dispatch(
      FeatFarewellCommentActions.postCommentFarewell({
        comment: {
          farewellId: this.farewellId(),
          profileId: currentProfile?.id ?? null,
          profile: currentProfile,
          content,
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
}
