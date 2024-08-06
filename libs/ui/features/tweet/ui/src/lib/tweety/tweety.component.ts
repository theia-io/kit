import { AsyncPipe, CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import {
  FeatReTweetActions,
  FeatTweetActions,
  FeatTweetBookmarkActions,
  selectIsBookmarked,
  selectTweet,
  tweetIsLikedByProfile,
} from '@kitouch/feat-tweet-data';
import { selectCurrentProfile, selectProfileById } from '@kitouch/kit-data';
import { Tweety, TweetyType } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { APP_PATH } from '@kitouch/ui-shared';
import { Store } from '@ngrx/store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import {
  ReplaySubject,
  combineLatest,
  combineLatestWith,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FeatTweetActionsComponent } from './actions/actions.component';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { position: relative; }'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    AsyncPipe,
    RouterModule,
    //
    OverlayPanelModule,
    InputTextareaModule,
    FloatLabelModule,
    //
    AccountTileComponent,
    FeatTweetActionsComponent,
    UiKitTweetButtonComponent,
  ],
})
export class FeatTweetTweetyComponent implements OnChanges {
  @Input({ required: true })
  tweetId!: Tweety['id'];

  @Output()
  tweetDeleted = new EventEmitter<void>();

  // Deps
  #document = inject(DOCUMENT);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);
  //
  domSanitizer = inject(DomSanitizer);
  // State
  #tweetId$$ = new ReplaySubject<Tweety['id']>(1);

  tweetTypes = TweetyType;

  // #tweet$ = new ReplaySubject<Tweety>(1);
  #tweet$ = this.#tweetId$$.pipe(
    switchMap((tweetId) => this.#store.select(selectTweet(tweetId))),
    filter(Boolean),
    shareReplay(1)
  );
  /** @TODO @FIXME Implement loader while tweet is loading */
  tweet = toSignal(this.#tweet$, {
    initialValue: {} as Tweety,
  }); /** @TODO @FIXME this initial value */

  #currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  currentProfile = toSignal(this.#currentProfile$);

  retweetProfile$ = combineLatest([
    this.#tweet$.pipe(
      filter(Boolean),
      filter(({ type }) => type === this.tweetTypes.Retweet)
    ),
    this.#currentProfile$,
  ]).pipe(
    switchMap(([retweet, profile]) =>
      retweet.referenceProfileId === profile.id
        ? of(profile)
        : this.#store.select(selectProfileById(retweet.referenceProfileId!))
    )
  );

  tweetProfile$ = this.#tweet$.pipe(
    switchMap((tweet) =>
      this.#store.select(selectProfileById(tweet.profileId))
    ),
    filter(Boolean)
  );

  // Component logic
  tweetComments$ = this.#tweet$.pipe(map(({ comments }) => comments));
  commentOverlayVisible = signal(false);

  tweetLiked$ = this.#tweet$.pipe(
    combineLatestWith(this.#currentProfile$),
    map(([tweet, currentProfile]) =>
      tweetIsLikedByProfile(tweet, currentProfile?.id)
    )
  );

  tweetCanBeDeleted$ = combineLatest([
    this.#currentProfile$,
    this.tweetProfile$,
  ]).pipe(
    map(
      ([currentProfile, tweetProfile]) =>
        currentProfile && tweetProfile && currentProfile.id === tweetProfile.id
    ),
    startWith(false)
  );

  tweetBookmarked$ = this.#tweet$.pipe(
    switchMap((tweet) => this.#store.select(selectIsBookmarked(tweet)))
  );

  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  /** Comment section */
  @HostListener('window:keydown.enter', ['$event'])
  keyDownEnterHandler() {
    if (this.commentOverlayVisible()) {
      this.commentHandler();
    }
  }

  commentControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  @ViewChild('commentOverlayTmpl')
  commentOverlayTmpl: OverlayPanel;

  ngOnChanges(changes: SimpleChanges): void {
    const tweetId = changes['tweetId'];

    if (
      !!tweetId.currentValue &&
      tweetId.currentValue !== tweetId.previousValue
    ) {
      this.#tweetId$$.next(tweetId.currentValue);
    }
  }

  tweetUrl(tweet: Tweety, absolute?: boolean) {
    return [
      absolute ? this.#document.location.origin : '/',
      APP_PATH.Profile,
      tweet.profileId,
      APP_PATH.Tweet,
      tweet.type === TweetyType.Retweet ? tweet.referenceId : tweet.id,
    ].join('/');
  }

  tweetClickHandler(tweet: Tweety) {
    this.#router.navigate([this.tweetUrl(tweet)]);
  }

  deleteHandler() {
    this.#tweet$
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((tweet) => {
        if (tweet.type === TweetyType.Retweet) {
          this.#store.dispatch(FeatReTweetActions.delete({ tweet }));
        } else {
          this.#store.dispatch(FeatTweetActions.delete({ tweet }));
        }
        this.tweetDeleted.emit();
      });
  }

  /** @TODO migrate commentHandler to a specific class and re-use it here and in tweet.component */
  commentHandler() {
    if (!this.commentControl.valid) {
      return;
    }

    this.#tweet$
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((tweet) => {
        const tweetuuidv4 = uuidv4();
        const content: string = this.commentControl.value as string;
        this.#store.dispatch(
          FeatTweetActions.comment({ uuid: tweetuuidv4, tweet, content })
        );

        this.commentControl.reset();
        this.commentOverlayTmpl.hide();
      });
  }

  retweetHandler() {
    this.#store.dispatch(FeatReTweetActions.reTweet({ tweet: this.tweet() }));
  }

  quoteHandler() {
    // this.#store.dispatch(FeatTweetActions.quote({tweet: this.tweet()}));
  }

  likeHandler() {
    this.#tweet$
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((tweet) => {
        this.#store.dispatch(FeatTweetActions.like({ tweet }));
      });
  }

  bookmarkHandler() {
    this.#tweet$
      .pipe(
        take(1),
        takeUntilDestroyed(this.#destroyRef),
        withLatestFrom(this.tweetBookmarked$)
      )
      .subscribe(([tweet, bookmarked]) => {
        if (bookmarked) {
          this.#store.dispatch(
            FeatTweetBookmarkActions.removeBookmark({ tweetId: tweet.id })
          );
        } else {
          this.#store.dispatch(
            FeatTweetBookmarkActions.bookmark({
              tweetId: tweet.id,
              profileIdTweetyOwner: tweet.profileId,
            })
          );
        }
      });
  }
}
