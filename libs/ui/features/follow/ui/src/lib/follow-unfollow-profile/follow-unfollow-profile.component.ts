import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FeatProfileApiActions,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { FollowButtonComponent } from '@kitouch/ui-components';
import { UXDynamicService } from '@kitouch/ui-shared';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { filter, take } from 'rxjs';

export const followerHandlerFn = () => {
  const store = inject(Store);
  const uxDynamicService = inject(UXDynamicService);

  return (profileId: Profile['id'], toFollow: boolean) => {
    if (!profileId) {
      console.error(
        '[followProfileHandler] Profile to follow - id was not provided'
      );
      return;
    }

    const newFollowList = (currentProfile: Profile) =>
      toFollow
        ? [...(currentProfile.following ?? []), { id: profileId }]
        : currentProfile.following?.filter(({ id }) => id !== profileId);

    store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        if (currentProfile.id === profileId) {
          console.info(
            'You cannot follow yourself',
            currentProfile.id,
            profileId
          );
          return;
        }

        if (
          toFollow &&
          currentProfile.following?.some(({ id }) => id === profileId)
        ) {
          console.info(
            'You already follow this profile',
            currentProfile.id,
            profileId
          );
          return;
        } else if (
          !toFollow &&
          !currentProfile.following?.some(({ id }) => id === profileId)
        ) {
          console.info(
            "You don't follow this profile",
            currentProfile.id,
            profileId
          );
          return;
        }

        store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: newFollowList(currentProfile),
            },
          })
        );
      });

    uxDynamicService.updateLogo('hello', 5000);
  };
};

@Component({
  standalone: true,
  selector: 'feat-follow-unfollow-profile',
  templateUrl: './follow-unfollow-profile.component.html',
  imports: [
    NgOptimizedImage,
    NgClass,
    //
    FollowButtonComponent,
    //
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFollowUnfollowProfileComponent {
  profileId = input.required<Profile['id']>();

  #store = inject(Store);
  #followerListHandler = followerHandlerFn();

  profile = computed(() =>
    this.#store.selectSignal(selectProfileById(this.profileId()))()
  );
  currentProfile = toSignal(this.#store.select(selectCurrentProfile));

  isFollowing = computed(
    () =>
      this.currentProfile()?.following?.some(
        ({ id }) => id === this.profileId()
      ) ?? false
  );

  followProfileHandler(profileId: Profile['id']) {
    this.#followerListHandler(profileId, true);
  }

  unFollowProfileHandler(profileId: Profile['id']) {
    this.#followerListHandler(profileId, false);
  }
}
