import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  selectAllTweets,
  selectTweetsProfileAndRetweets,
  TweetApiActions,
} from '@kitouch/feat-tweet-data';
import { FeatTweetTweetyComponent } from '@kitouch/feat-tweet-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH_DIALOG, OUTLET_DIALOG } from '@kitouch/shared-constants';
import {
  DividerComponent,
  UiCompCardComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
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
    ButtonModule,
    RouterModule,
    //
    UiCompCardComponent,
    FeatTweetTweetyComponent,
    DividerComponent,
    UiKitTweetButtonComponent,
  ],
})
export class PageProfileTweetsComponent {
  #store = inject(Store);
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  #profileId$ = this.#activatedRouter.parent?.params.pipe(
    map((params) => params['profileId'])
  );

  #profile$ = this.#profileId$
    ? this.#profileId$.pipe(
        switchMap((profileId) =>
          this.#store.select(selectProfileById(profileId))
        ),
        filter(Boolean),
        shareReplay(1)
      )
    : throwError(
        () =>
          'Cannot continue without profile id. likely component is used incorrectly'
      );

  profile = toSignal(this.#profile$);
  profilePic = computed(() => profilePicture(this.profile() ?? {}));

  tweets$ = combineLatest([
    this.#profile$,
    this.#store.select(selectAllTweets),
  ]).pipe(
    map(([{ id }, allTweets]) => selectTweetsProfileAndRetweets(id, allTweets))
  );

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
      { outlets: { [OUTLET_DIALOG]: [APP_PATH_DIALOG.Tweet] } },
    ]);
  }
}
