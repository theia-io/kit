import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
} from '@angular/core';
import {
  FeatProfileApiActions,
  profilePicture,
  selectCurrentProfile,
  selectProfileFollowingOrNot,
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
  switchMap,
  take,
} from 'rxjs';
import { FeatFollowProfileCardComponent } from '../profile-card/profile-card.component';
import {
  AccountTileComponent,
  FollowButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { APP_PATH } from '@kitouch/ui/shared';

export interface FeatFollowSuggestionsComponentConfig {
  cards: boolean;
  showFollowed: boolean;
  showRandomOrder: boolean;
  profilesToDisplay: number;
}

@Component({
  standalone: true,
  selector: 'feat-follow-suggestions',
  templateUrl: './suggestions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    //

    //
    UiCompCardComponent,
    FollowButtonComponent,
    AccountTileComponent,
    FeatFollowProfileCardComponent,
  ],
})
export class FeatFollowSuggestionsComponent {
  suggestionConfig = input<Partial<FeatFollowSuggestionsComponentConfig>>({
    cards: false,
    showFollowed: true,
    showRandomOrder: true,
    profilesToDisplay: 10,
  });

  #store = inject(Store);

  readonly profileUrlPath = APP_PATH.Profile;
  readonly profilePicture = profilePicture;

  #exColleaguesProfiles$ = this.#store.select(
    selectColleaguesProfilesSuggestions
  );

  exColleaguesDisplaySettings$ = this.#exColleaguesProfiles$.pipe(
    switchMap((exColleaguesSuggestions) =>
      this.#store
        .select(selectProfileFollowingOrNot(exColleaguesSuggestions))
        .pipe(
          map(([followingProfilesMap, notFollowingProfilesMap]) => {
            let resultProfiles = [...exColleaguesSuggestions];

            if (!this.suggestionConfig().showFollowed) {
              resultProfiles = resultProfiles.filter((profile) =>
                !followingProfilesMap.has(profile.id)
              );
            }

            if (!this.suggestionConfig().showRandomOrder) {
              resultProfiles = resultProfiles.sort((p1, p2) =>
                notFollowingProfilesMap.has(p1.id) >
                notFollowingProfilesMap.has(p2.id)
                  ? -1
                  : 1
              );
            }

            return resultProfiles.slice(
              0,
              (this.suggestionConfig().profilesToDisplay ?? 10)
            );
          })
        )
    )
    // map((profilesSuggested) => profilesSuggested.slice(0, this.suggestionConfig().profilesToDisplay))
  );

  followedProfilesMap$: Observable<{ [profileId: string]: boolean }> =
    combineLatest([
      this.#store.select(selectCurrentProfile),
      this.#store.select(selectColleaguesProfilesSuggestions),
    ]).pipe(
      map(([currentProfile, exColleagues]) => {
        const currentProfileFollowingSet = new Set(
          currentProfile?.following?.map(({ id }) => id)
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
              following: [
                ...(currentProfile.following ?? []),
                { id: profile.id },
              ],
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
              following: currentProfile.following?.filter(
                ({ id }) => id !== profile.id
              ),
            },
          })
        );
      });
  }
}
