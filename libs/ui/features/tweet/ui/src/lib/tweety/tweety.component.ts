import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  FeatTweetActions,
  FeatTweetBookmarkActions,
  selectIsBookmarked,
  selectTweet,
  tweetIsLikedByProfile
} from '@kitouch/features/tweet/data';
import {
  selectCurrentProfile,
  selectProfile,
} from '@kitouch/features/kit/data';
import { Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  TweetButtonComponent,
} from '@kitouch/ui/components';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import {
  ReplaySubject,
  combineLatestWith,
  filter,
  map,
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    AsyncPipe,
    //
    OverlayPanelModule,
    SidebarModule,
    InputTextareaModule,
    FloatLabelModule,
    //
    AccountTileComponent,
    FeatTweetActionsComponent,
    TweetButtonComponent,
  ],
})
export class FeatTweetTweetyComponent implements OnInit {
  @Input({ required: true })
  tweet!: Tweety; /** @TODO @FIXME think on converting to tweet id */
  // Deps
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);
  //
  domSanitizer = inject(DomSanitizer);
  // State
  #tweet$$ = new ReplaySubject<Tweety>(1);

  #currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  tweetProfile$ = this.#tweet$$.pipe(
    switchMap((tweet) => this.#store.select(selectProfile(tweet.profileId))),
    startWith(this.tweet?.denormalization?.profile ?? undefined),
    filter(Boolean)
  );

  // Component logic
  tweetComments$ = this.#tweet$$.pipe(map(({ comments }) => comments));

  tweetLiked$ = this.#tweet$$.pipe(
    combineLatestWith(this.#currentProfile$),
    map(([tweet, currentProfile]) =>
      tweetIsLikedByProfile(tweet, currentProfile?.id)
    )
  );

  tweetBookmarked$ = this.#tweet$$.pipe(
    switchMap((tweet) => this.#store.select(selectIsBookmarked(tweet)))
  );

  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  /** Comment section */
  @HostListener('window:keydown.enter', ['$event'])
  keyDownEnterHandler() {
    this.tweetCommentHandler();
  }

  commentSideBar = false;
  commentControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  @ViewChild('commentOverlayTmpl')
  commentOverlayTmpl: OverlayPanel;

  ngOnInit(): void {
    if (this.tweet.id) {
      this.#store
        .select(selectTweet(this.tweet.id))
        .pipe(filter(Boolean), takeUntilDestroyed(this.#destroyRef))
        .subscribe((tweet) => {
          this.#tweet$$.next(tweet);
        });
    }
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

  tweetCommentHandler() {
    if (!this.commentControl.valid) {
      return;
    }

    this.#tweet$$
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((tweet) => {
        const tweetuuidv4 = uuidv4();
        const content: string = this.commentControl.value as string;
        this.#store.dispatch(
          FeatTweetActions.comment({ uuid: tweetuuidv4, tweet, content })
        );

        this.commentControl.setValue('');
        this.commentOverlayTmpl.hide();
      });
  }

  repostHandler() {
    console.info('Implement repostHandler');
  }

  likeHandler() {
    this.#tweet$$
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((tweet) => {
        this.#store.dispatch(FeatTweetActions.like({ tweet }));
      });
  }

  shareHandler() {
    console.info('Implement shareHandler');
  }

  bookmarkHandler() {
    this.#tweet$$
      .pipe(
        take(1),
        takeUntilDestroyed(this.#destroyRef),
        withLatestFrom(this.tweetBookmarked$)
      )
      .subscribe(([tweet, bookmarked]) => {
        if(bookmarked) {
          this.#store.dispatch(
            FeatTweetBookmarkActions.removeBookmark({ tweetId: tweet.id })
          );
        }  else {
          this.#store.dispatch(
            FeatTweetBookmarkActions.bookmark({ tweetId: tweet.id })
          );
        }
      });
  }
}
