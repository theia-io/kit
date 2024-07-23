import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import {
  FeatProfileApiActions,
  profilePicture,
  selectCurrentProfile,
  selectFollowingAndNotProfilesMap,
} from '@kitouch/features/kit/data';
import { Profile } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  FollowButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { selectColleaguesProfilesSuggestions } from '@kitouch/ui/features/follow/data';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  take
} from 'rxjs';
import { FeatFollowProfileCardComponent } from '../profile-card/profile-card.component';

interface FeatFollowSuggestionsComponentConfig {
  cards: boolean;
  showFollowed: boolean;
  showRandomOrder: boolean;
  profilesToDisplay: number;
}

interface FeatFollowSuggestedProfile extends Profile {
  followed: boolean;
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

  suggestedExColleaguesProfilesConfigured$: Observable<
    FeatFollowSuggestedProfile[]
  > = combineLatest([
    this.#store.select(selectColleaguesProfilesSuggestions),
    this.#store.select(selectCurrentProfile),
  ]).pipe(
    switchMap(([exColleaguesSuggestions, currentProfile]) =>
      this.#store
        .select(selectFollowingAndNotProfilesMap(exColleaguesSuggestions))
        .pipe(
          map(([followingProfilesMap, notFollowingProfilesMap]) => {
            let resultProfiles = [...exColleaguesSuggestions];

            if (!this.suggestionConfig().showFollowed) {
              resultProfiles = resultProfiles.filter(
                (profile) => !followingProfilesMap.has(profile.id)
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
              this.suggestionConfig().profilesToDisplay ?? 10
            );
          }),
          // enrich with an id who is already been followed
          map((listProfilesToShowToUser) => {
            const currentProfileFollowingSet = new Set(
              currentProfile?.following?.map(({ id }) => id)
            );
            return listProfilesToShowToUser.map(
              (suggestedProfile) => ({
                ...suggestedProfile,
                followed: currentProfileFollowingSet.has(suggestedProfile.id),
              }),
              {}
            );
          })
        )
    ),
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
