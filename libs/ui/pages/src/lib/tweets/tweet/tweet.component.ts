import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TweetApiActions, selectTweet } from '@kitouch/features/tweet/data';
import { selectProfile } from '@kitouch/features/kit/ui';
import { Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { FeatTweetTweetyComponent } from '@kitouch/features/tweet/ui';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { TimelineModule } from 'primeng/timeline';
import { combineLatest, forkJoin, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-tweet',
  templateUrl: './tweet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    //
    TimelineModule,
    //
    AccountTileComponent,
    DividerComponent,
    UiCompCardComponent,
    FeatTweetTweetyComponent,
  ],
})
export class PageTweetComponent {
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);

  #ids$ = this.#activatedRouter.params.pipe(
    map((params) => ({ tweetId: params['id'], profileId: params['profileId'] }))
  );

  tweet$ = this.#ids$.pipe(
    switchMap(({ tweetId }) => this.#store.select(selectTweet(tweetId))),
    filter((tweet): tweet is Tweety => !!tweet),
    shareReplay()
  );

  tweetComments$ = this.tweet$.pipe(
    map(({comments}) => comments),
    filter(Boolean),
    switchMap((comments) => {
      if (!comments) return of([]);

      const commentProfileObservables = comments.map((comment) =>
        this.#store.select(selectProfile(comment.profileId!))
      );

      return combineLatest(commentProfileObservables).pipe(
        map((profiles) => {
          return comments?.map((comment) => {
            const commentProfile = profiles.find(
              (profile) => profile?.id === comment.profileId
            );
            return {
              ...comment,
              denormalization: {
                profile: commentProfile,
              },
            };
          });
        })
      );
    }),
  );

  readonly profileUrlPath = `/${APP_PATH.Profile}/`;

  constructor() {
    this.#ids$
      .pipe(takeUntilDestroyed())
      .subscribe(({ tweetId, profileId }) =>
        this.#store.dispatch(TweetApiActions.get({ ids: [{tweetId, profileId}] }))
      );
  }

  tweetDeletedHandler() {
    this.#router.navigateByUrl('/');
  }
}
