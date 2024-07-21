import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { selectCurrentProfile, selectProfile } from '@kitouch/features/kit/ui';
import { TweetApiActions, selectTweet } from '@kitouch/features/tweet/data';
import { FeatTweetTweetyComponent } from '@kitouch/features/tweet/ui';
import { Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { TimelineModule } from 'primeng/timeline';
import { combineLatest, of } from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-tweet',
  templateUrl: './tweet.component.html',
  styles: [
    `
      :host ::ng-deep .kit-timeline .p-timeline-event {
        .p-timeline-event-content {
          flex-grow: 3;
          padding-bottom: 16px;
        }
      }
    `,
  ],
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
    map((params) => ({
      tweetId: params['id'],
      profileIdOrAlias: params['profileIdOrAlias'],
    }))
  );

  #profile$ = this.#ids$.pipe(
    switchMap(({ profileIdOrAlias }) =>
      this.#store.select(selectProfile(profileIdOrAlias))
    ),
    filter(Boolean),
    shareReplay(1)
  );

  #currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  tweet$ = this.#ids$.pipe(
    switchMap(({ tweetId }) => this.#store.select(selectTweet(tweetId))),
    filter((tweet): tweet is Tweety => !!tweet),
    shareReplay()
  );

  tweetComments$ = this.tweet$.pipe(
    map(({ comments }) => comments),
    filter(Boolean),
    withLatestFrom(this.#currentProfile$),
    switchMap(([comments, currentProfile]) => {
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
              canBeDeleted: commentProfile?.id === currentProfile.id,
              denormalization: {
                profile: commentProfile,
              },
            };
          });
        })
      );
    })
  );

  readonly profileUrlPath = `/${APP_PATH.Profile}/`;

  constructor() {
    combineLatest([
      this.#ids$,  
      this.#profile$
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([{ tweetId }, { id }]) =>
        this.#store.dispatch(
          TweetApiActions.get({ ids: [{ tweetId, profileId: id }] })
        )
      );
  }

  tweetDeletedHandler() {
    this.#router.navigateByUrl('/');
  }

  commentDeleteHandler() {
    console.log('Implement comment removal');
  }
}
