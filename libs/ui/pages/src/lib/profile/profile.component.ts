import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FeatProfileApiActions,
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { FollowButtonComponent } from '@kitouch/ui-components';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { filter, map, shareReplay, switchMap, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterModule,
    NgOptimizedImage,
    //
    TabMenuModule,
    ButtonModule,
    //
    FollowButtonComponent,
  ],
})
export class PageProfileComponent {
  #store = inject(Store);
  #activatedRouter = inject(ActivatedRoute);

  #profileIdOrAlias$ = this.#activatedRouter.params.pipe(
    map((params) => params['profileIdOrAlias'])
  );

  #profile$ = this.#profileIdOrAlias$.pipe(
    switchMap((profileIdOrAlias) =>
      this.#store.select(selectProfileById(profileIdOrAlias))
    ),
    filter(Boolean),
    shareReplay(1)
  );

  profile = toSignal(this.#profile$);
  profilePic = computed(() => profilePicture(this.profile() ?? {}));

  currentProfile = toSignal(this.#store.select(selectCurrentProfile));

  isCurrentUserProfile = computed(
    () => this.currentProfile()?.id === this.profile()?.id
  );
  isFollowing = computed(
    () =>
      this.currentProfile()?.following?.some(
        ({ id }) => id === this.profile()?.id
      ) ?? false
  );

  items: MenuItem[] = [
    { label: 'Tweets', icon: 'pi pi-inbox', routerLink: 'tweets' },
    { label: 'Experience', icon: 'pi pi-briefcase', routerLink: 'experience' },
  ];

  followProfileHandler(profile: Profile | undefined) {
    if (!profile) {
      return;
    }
    this.#store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: [
                ...(currentProfile.following ?? []),
                { id: profile.id },
              ],
            },
          })
        );
      });
  }

  unFollowProfileHandler(profile: Profile | undefined) {
    if (!profile) {
      return;
    }
    this.#store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: currentProfile.following?.filter(
                ({ id }) => id !== profile.id
              ),
            },
          })
        );
      });
  }
}
