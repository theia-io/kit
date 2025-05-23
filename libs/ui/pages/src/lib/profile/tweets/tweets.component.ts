import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  selectAllTweets,
  selectTweetsLazyState,
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
  UiKitSpinnerComponent,
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
    UiKitSpinnerComponent,
  ],
})
export class PageProfileTweetsComponent {
  #store = inject(Store);
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  loadMoreTmpl = viewChild<ElementRef<HTMLButtonElement>>('loadMoreTmpl');

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

  tweetsLazyState = this.#store.selectSignal(selectTweetsLazyState);

  #loadingTweetsIntersectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.#profile$.pipe(takeUntilDestroyed()).subscribe(({ id }) =>
      this.#store.dispatch(
        TweetApiActions.getTweetsForProfile({
          profileId: id,
          nextCursor: null,
          hasNextPage: null,
        })
      )
    );

    effect(() => {
      const loadMoreTmpl = this.loadMoreTmpl();
      if (this.#loadingTweetsIntersectionObserver) {
        this.#loadingTweetsIntersectionObserver.disconnect();
      }
      if (!loadMoreTmpl) {
        return;
      }

      const profileId = this.profile()?.id;

      const { nextCursor, hasNextPage } = untracked(this.tweetsLazyState);

      if (!hasNextPage || !nextCursor || !profileId) {
        return;
      }

      this.#loadingTweetsIntersectionObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) {
            return;
          }

          this.#store.dispatch(
            TweetApiActions.getTweetsForProfile({
              profileId: profileId,
              nextCursor,
              hasNextPage,
            })
          );
        }
      );

      // start observing
      this.#loadingTweetsIntersectionObserver.observe(
        loadMoreTmpl.nativeElement
      );
    });
  }

  tweetButtonHandler() {
    this.#router.navigate([
      { outlets: { [OUTLET_DIALOG]: [APP_PATH_DIALOG.Tweet] } },
    ]);
  }
}
