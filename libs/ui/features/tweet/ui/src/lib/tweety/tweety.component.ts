import { DOCUMENT, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewChild,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import {
  FeatReTweetActions,
  FeatTweetActions,
  FeatBookmarksActions,
  selectIsBookmarked,
  selectTweet,
  tweetIsLikedByProfile,
  tweetIsRetweet,
} from '@kitouch/feat-tweet-data';
import { selectCurrentProfile, selectProfileById } from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { ReTweety, Tweety, TweetyType } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  UiKitDeleteComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { v4 as uuidv4 } from 'uuid';
import { RetweetHeaderComponent } from '../retweet/retweet-header.component';
import { FeatTweetActionsComponent } from './actions/actions.component';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { position: relative; cursor: pointer; }'],
  imports: [
    ReactiveFormsModule,
    DatePipe,
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
  ],
})
export class FeatTweetTweetyComponent {
  tweetId = input<Tweety['id']>();
  tweetDeleted = output<void>();

  // Deps
  #document = inject(DOCUMENT);
  #router = inject(Router);
  #store = inject(Store);
  //
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
    const tweet = this.tweet();

    if (tweet && tweetIsRetweet(tweet)) {
      return this.#store.selectSignal(
        selectProfileById((tweet as ReTweety).referenceProfileId)
      )();
    }
    return undefined;
  });

  // Component logic
  commentOverlayVisible = signal(false);

  tweetComments = computed(() => this.tweet()?.comments);

  tweetLiked = computed(() => {
    const tweet = this.tweet(),
      profile = this.currentProfile();

    if (tweet && profile) {
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

    const profileToVerify =
      tweet.type === TweetyType.Tweet ? tweetProfile : retweetProfile;

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
    if (tweet && this.commentOverlayVisible()) {
      this.commentHandler(tweet);
    }
  }

  commentControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  tweetIsRetweetFn = tweetIsRetweet;

  tweetUrl(tweet: Tweety | ReTweety, absolute?: boolean) {
    return [
      absolute ? this.#document.location.origin : '/',
      APP_PATH.Profile,
      tweet.profileId,
      APP_PATH.Tweet,
      tweet.type === TweetyType.Retweet
        ? (tweet as ReTweety).referenceId
        : tweet.id,
    ].join('/');
  }

  tweetClickHandler(tweet: Tweety | ReTweety) {
    this.#router.navigate([this.tweetUrl(tweet)]);
  }

  deleteHandler(tweet: Tweety | ReTweety) {
    if (tweetIsRetweet(tweet)) {
      this.#store.dispatch(FeatReTweetActions.delete({ tweet }));
    } else {
      this.#store.dispatch(FeatTweetActions.delete({ tweet }));
    }
    this.tweetDeleted.emit();
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
