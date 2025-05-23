import { DatePipe, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import {
  FeatBookmarksActions,
  FeatReTweetActions,
  FeatTweetActions,
  selectIsBookmarked,
  selectTweet,
  tweetIsLikedByProfile,
  tweetIsRetweet,
  tweetIsTweet,
} from '@kitouch/feat-tweet-data';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { ReTweety, Tweety, TweetyType } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  UiKitDeleteComponent,
  UiKitSpinnerComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { merge, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { RetweetHeaderComponent } from '../retweet-header/retweet-header.component';
import { FeatTweetActionsComponent } from './actions/actions.component';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { position: relative; cursor: pointer; }'],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    //
    OverlayPanelModule,
    InputTextareaModule,
    FloatLabelModule,
    DialogModule,
    ButtonModule,
    //
    RetweetHeaderComponent,
    AccountTileComponent,
    FeatTweetActionsComponent,
    UiKitTweetButtonComponent,
    UiKitDeleteComponent,
    UiKitSpinnerComponent,
  ],
  providers: [DatePipe],
})
export class FeatTweetTweetyComponent {
  tweetId = input<Tweety['id']>();
  tweetDeleted = output<void>();

  // Deps
  #document = inject(DOCUMENT);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #actions = inject(Actions);
  #store = inject(Store);
  #datePipe = inject(DatePipe);
  domSanitizer = inject(DomSanitizer);

  tweetTypes = TweetyType;

  currentProfile = toSignal(this.#store.select(selectCurrentProfile));

  tweet = computed(() => {
    return this.#store.selectSignal(selectTweet(this.tweetId() ?? ''))();
  });

  tweetProfile = computed(() => {
    const tweet = this.tweet();
    if (tweet) {
      return this.#store.selectSignal(selectProfileById(tweet.profileId))();
    }
    return undefined;
  });

  retweetProfile = computed(() => {
    const retweet = this.tweet();

    if (retweet && tweetIsRetweet(retweet)) {
      return this.#store.selectSignal(
        selectProfileById(retweet.retweetedProfileId)
      )();
    }

    return undefined;
  });

  // Component logic
  commentOverlayVisible = signal(false);

  tweetHeaderSecondaryText = computed(() => {
    const tweet = this.tweet();

    if (!tweet) {
      return 'loading...';
    }

    const tweetCreatedDate = tweet.createdAt;
    if (tweetCreatedDate) {
      const secondaryText = tweetIsRetweet(tweet)
        ? 'retweeted on ' +
          this.#datePipe.transform(tweet.createdAt, 'MMM d, h:mm a')
        : 'tweeted on ' +
          this.#datePipe.transform(tweet.createdAt, 'MMM d, h:mm a');

      return secondaryText;
    }

    return '';
  });

  tweetComments = computed(() => {
    const tweet = this.tweet();
    if (tweet && tweetIsTweet(tweet)) {
      return tweet.comments;
    }
    return [];
  });

  tweetLiked = computed(() => {
    const tweet = this.tweet(),
      profile = this.currentProfile();

    if (tweet && tweetIsTweet(tweet) && profile) {
      return tweetIsLikedByProfile(tweet, profile.id);
    }

    return false;
  });

  tweetDeleteConfirmationVisible = signal(false);

  tweetCanBeDeleted = computed(() => {
    const tweet = this.tweet(),
      currentProfile = this.currentProfile(),
      tweetProfile = this.tweetProfile(),
      retweetProfile = this.retweetProfile();

    if (!tweet) {
      return false;
    }

    const profileToVerify = tweetIsTweet(tweet) ? tweetProfile : retweetProfile;

    if (currentProfile && profileToVerify) {
      return (
        currentProfile &&
        profileToVerify &&
        currentProfile.id === profileToVerify.id
      );
    }

    return false;
  });

  tweetBookmarked = computed(() => {
    const tweet = this.tweet();
    return !!tweet && this.#store.selectSignal(selectIsBookmarked(tweet))();
  });

  readonly profileUrlPath = `/${APP_PATH.Profile}/`;

  @ViewChild('commentOverlayTmpl')
  commentOverlayTmpl: OverlayPanel;

  @HostListener('click')
  tweetyClickHandler() {
    const tweet = this.tweet();
    if (tweet) {
      this.tweetClickHandler(tweet);
    }
  }

  @HostListener('window:keydown.enter', ['$event'])
  keyDownEnterHandler() {
    const tweet = this.tweet();
    if (tweet && tweetIsTweet(tweet) && this.commentOverlayVisible()) {
      this.commentHandler(tweet);
    }
  }

  commentControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  tweetIsRetweetFn = tweetIsRetweet;

  profilePicture = profilePicture;

  tweetUrl(tweet: Tweety | ReTweety, absolute?: boolean) {
    return [
      absolute ? this.#document.location.origin : '/',
      APP_PATH.Profile,
      tweet.profileId,
      APP_PATH.Tweet,
      tweet.type === TweetyType.Retweet
        ? (tweet as ReTweety).tweetId
        : tweet.id,
    ].join('/');
  }

  tweetClickHandler(tweet: Tweety | ReTweety) {
    this.#router.navigate([this.tweetUrl(tweet)]);
  }

  deleteHandler(tweet: Tweety | ReTweety) {
    merge(
      this.#actions.pipe(ofType(FeatReTweetActions.deleteSuccess)),
      this.#actions.pipe(ofType(FeatTweetActions.deleteSuccess))
    )
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.tweetDeleted.emit());

    if (tweetIsRetweet(tweet)) {
      this.#store.dispatch(FeatReTweetActions.delete({ tweet }));
    } else {
      this.#store.dispatch(FeatTweetActions.delete({ tweet }));
    }
  }

  /** @TODO migrate commentHandler to a specific class and re-use it here and in tweet.component */
  commentHandler(tweet: Tweety) {
    if (!this.commentControl.valid) {
      return;
    }

    const tweetuuidv4 = uuidv4();
    const content: string = this.commentControl.value as string;
    this.#store.dispatch(
      FeatTweetActions.comment({ uuid: tweetuuidv4, tweet, content })
    );

    this.commentControl.reset();
    this.commentOverlayTmpl.hide();
  }

  retweetHandler(tweet: Tweety) {
    this.#store.dispatch(FeatReTweetActions.reTweet({ tweet }));
  }

  quoteHandler() {
    // this.#store.dispatch(FeatTweetActions.quote({tweet: this.tweet()}));
  }

  likeHandler(tweet: Tweety) {
    this.#store.dispatch(FeatTweetActions.like({ tweet }));
  }

  bookmarkHandler(tweet: Tweety) {
    const bookmarked = this.tweetBookmarked();
    if (bookmarked) {
      this.#store.dispatch(
        FeatBookmarksActions.removeBookmark({ tweetId: tweet.id })
      );
    } else {
      this.#store.dispatch(
        FeatBookmarksActions.bookmark({
          tweetId: tweet.id,
          profileIdTweetyOwner: tweet.profileId,
        })
      );
    }
  }
}
