import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { selectColleaguesProfilesSuggestions } from '@kitouch/feat-follow-data';
import {
  profilePicture,
  selectCurrentProfile,
  selectFollowingAndNotProfilesMap,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { Profile } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  FollowButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { combineLatest, map, Observable, shareReplay, switchMap } from 'rxjs';
import { followerHandlerFn } from '../follow-unfollow-profile/follow-unfollow-profile.component';
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
    AsyncPipe,
    RouterModule,
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

  readonly settingsPageUrl = `/${APP_PATH.Settings}`;
  readonly profileUrlPath = `/${APP_PATH.Profile}`;
  readonly profilePicture = profilePicture;
  #followerHandlerFn = followerHandlerFn();

  suggestedExColleaguesProfilesConfigured$: Observable<
    FeatFollowSuggestedProfile[]
  > = combineLatest([
    this.#store.select(selectColleaguesProfilesSuggestions),
    this.#store.select(selectCurrentProfile),
  ]).pipe(
    switchMap(([exColleaguesSuggestions, currentProfile]) =>
      this.#store.pipe(
        select(selectFollowingAndNotProfilesMap(exColleaguesSuggestions)),
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
    this.#followerHandlerFn(profile.id, true);
  }

  unFollowProfileHandler(profile: Profile) {
    this.#followerHandlerFn(profile.id, false);
  }
}
