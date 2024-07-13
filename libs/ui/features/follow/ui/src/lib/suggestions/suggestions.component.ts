import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FeatProfileApiActions,
  selectCurrentProfile,
} from '@kitouch/features/kit/data';
import { Profile } from '@kitouch/shared/models';
import { selectColleaguesProfilesSuggestions } from '@kitouch/ui/features/follow/data';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  take,
} from 'rxjs';
import { FeatFollowProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  standalone: true,
  selector: 'feat-follow-suggestions',
  templateUrl: './suggestions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    //

    //
    FeatFollowProfileCardComponent,
  ],
})
export class FeatFollowSuggestionsComponent {
  #store = inject(Store);

  exColleaguesProfiles$ = this.#store
    .select(selectColleaguesProfilesSuggestions)
    .pipe(map((profilesSuggested) => profilesSuggested.slice(0, 10)));

  followedProfilesMap$: Observable<{ [profileId: string]: boolean }> =
    combineLatest([
      this.#store.select(selectCurrentProfile),
      this.exColleaguesProfiles$,
    ]).pipe(
      filter(Boolean),
      map(([currentProfile, exColleagues]) => {
        const currentProfileFollowingSet = new Set(
          currentProfile?.following.map(({ id }) => id)
        );
        return exColleagues.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: currentProfileFollowingSet.has(curr.id),
          }),
          {}
        );
      }),
      shareReplay(1)
    );

  followProfileHandler(profile: Profile) {
    this.#store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: [...currentProfile.following, { id: profile.id }],
            },
          })
        );
      });
  }

  unFollowProfileHandler(profile: Profile) {
    this.#store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: currentProfile.following.filter(
                ({ id }) => id !== profile.id
              ),
            },
          })
        );
      });
  }
}
