import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { selectCurrentProfile, selectProfile } from '@kitouch/features/kit/ui';
import {
  FeatTweetActions,
  TweetApiActions,
  selectTweet,
} from '@kitouch/features/tweet/data';
import {
  FeatTweetTweetyComponent,
  TWEET_CONTROL_INITIAL_ROWS,
} from '@kitouch/features/tweet/ui';
import { TweetComment, Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  UiKitTweetButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import { combineLatest, of } from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

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
    ReactiveFormsModule,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UiKitTweetButtonComponent,
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
  tweet = toSignal(this.tweet$);

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

  @HostListener('window:keydown', ['$event'])
  keyDownEnterHandler(event: KeyboardEvent) {
    if (
      this.commentContentControl.valid &&
      event.key === 'Enter' &&
      (event.metaKey || event.ctrlKey) // Check for Cmd/Ctrl key
    ) {
      this.commentHandler();
      // Your Cmd/Ctrl Enter logic here
    }
  }

  commentContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);
  commentContentControlRows = TWEET_CONTROL_INITIAL_ROWS;

  constructor() {
    combineLatest([this.#ids$, this.#profile$])
      .pipe(takeUntilDestroyed())
      .subscribe(([{ tweetId }, { id }]) =>
        this.#store.dispatch(
          TweetApiActions.get({ ids: [{ tweetId, profileId: id }] })
        )
      );
  }

  commentHandler() {
    if (!this.commentContentControl.valid) {
      return;
    }

    const tweet = this.tweet();
    if (!tweet) {
      return;
    }

    const tweetuuidv4 = uuidv4();
    const content: string = this.commentContentControl.value as string;
    this.#store.dispatch(
      FeatTweetActions.comment({ uuid: tweetuuidv4, tweet, content })
    );

    this.commentContentControl.reset();
    this.commentContentControlRows = TWEET_CONTROL_INITIAL_ROWS;
  }

  commentControlBlur() {
    if (!this.commentContentControl.value?.length) {
      this.commentContentControlRows = TWEET_CONTROL_INITIAL_ROWS;
      return;
    }
  }

  tweetDeletedHandler() {
    this.#router.navigateByUrl('/');
  }

  commentDeleteHandler(tweet: Tweety, comment: TweetComment) {
    this.#store.dispatch(FeatTweetActions.commentDelete({ tweet, comment }));
  }
}
