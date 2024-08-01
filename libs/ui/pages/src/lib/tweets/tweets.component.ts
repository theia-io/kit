import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { profilePicture, selectProfileById } from '@kitouch/kit-data';
import { TweetApiActions, selectTweetsProfile } from '@kitouch/feat-tweet-data';
import { FeatTweetTweetyComponent } from '@kitouch/feat-tweet-ui';
import { Tweety } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  DividerComponent,
  UiKitTweetButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui-components';
import { APP_PATH } from '@kitouch/ui-shared';
import { Store } from '@ngrx/store';
import { filter, map, shareReplay, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-tweets',
  templateUrl: './tweets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    //
    UiCompCardComponent,
    FeatTweetTweetyComponent,
    AccountTileComponent,
    DividerComponent,
    UiKitTweetButtonComponent,
  ],
})
export class PageTweetsComponent {
  #store = inject(Store);
  #router = inject(Router);

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

  tweets$ = this.#profile$.pipe(
    switchMap(({ id }) => this.#store.select(selectTweetsProfile(id))),
    filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
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
