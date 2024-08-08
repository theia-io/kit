import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectAllTweets,
  selectTweetsProfile,
  TweetApiActions,
} from '@kitouch/feat-tweet-data';
import { FeatTweetTweetyComponent } from '@kitouch/feat-tweet-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { Tweety } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { APP_PATH, APP_PATH_DIALOG, OUTLET_DIALOG } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import {
  combineLatest,
  filter,
  map,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-profile-tweets',
  templateUrl: './tweets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    //
    UiCompCardComponent,
    FeatTweetTweetyComponent,
    AccountTileComponent,
    DividerComponent,
    UiKitTweetButtonComponent,
  ],
})
export class PageProfileTweetsComponent {
  #store = inject(Store);
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  #profileIdOrAlias$ = this.#activatedRouter.parent?.params.pipe(
    map((params) => params['profileIdOrAlias'])
  );

  #profile$ = this.#profileIdOrAlias$
    ? this.#profileIdOrAlias$.pipe(
        switchMap((profileIdOrAlias) =>
          this.#store.select(selectProfileById(profileIdOrAlias))
        ),
        filter(Boolean),
        shareReplay(1)
      )
    : throwError(
        () =>
          'Cannot continue without profile id. likely component is user incorrectly'
      );

  profile = toSignal(this.#profile$);
  profilePic = computed(() => profilePicture(this.profile() ?? {}));

  tweets$ = combineLatest([
    this.#profile$,
    this.#store.select(selectAllTweets),
  ]).pipe(map(([{ id }, allTweets]) => selectTweetsProfile(id, allTweets)));

  currentProfile = toSignal(
    this.#store.pipe(select(selectCurrentProfile), filter(Boolean))
  );

  isCurrentUserProfile = computed(
    () => this.currentProfile()?.id === this.profile()?.id
  );

  constructor() {
    this.#profile$
      .pipe(takeUntilDestroyed())
      .subscribe(({ id }) =>
        this.#store.dispatch(
          TweetApiActions.getTweetsForProfile({ profileId: id })
        )
      );
  }

  tweetButtonHandler() {
    this.#router.navigate([
      { outlets: { [OUTLET_DIALOG]: APP_PATH_DIALOG.Tweet } },
    ]);
  }

  tweetClickHandler(tweet: Tweety) {
    this.#router.navigate([
      '/',
      APP_PATH.Profile,
      tweet.profileId,
      APP_PATH.Tweet,
      tweet.id,
    ]);
  }
}
