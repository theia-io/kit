import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FeatTweetActions } from '@kitouch/features/tweet/data';
import { Tweety } from '@kitouch/shared/models';
import { TweetButtonComponent } from '@kitouch/ui/components';
import {
  APP_PATH,
  AuthService,
  TWEET_NEW_TWEET_TIMEOUT,
} from '@kitouch/ui/shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { map, take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { FeatTweetTweetingActionsComponent } from './actions/actions.component';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweeting',
  templateUrl: './tweeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    ToastModule,
    //
    TweetButtonComponent,
    FeatTweetTweetingActionsComponent,
  ],
  providers: [MessageService],
})
export class FeatTweetTweetingComponent {
  #destroyRef = inject(DestroyRef);
  #actions = inject(Actions);
  #router = inject(Router);

  #auth = inject(AuthService);
  #store = inject(Store);
  #messageService = inject(MessageService);
  // #snackBar = inject(MatSnackBar);

  @HostListener('window:keydown.enter', ['$event'])
  keyDownEnterHandler() {
    this.tweetingHandle();
  }

  profilePic$ = this.#auth.currentProfile$.pipe(
    map((profiles) => profiles?.pictures?.[0]?.url)
  );

  tweetContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  tweet = signal<Tweety | null>(null);
  tweettingInProgress = signal(false);

  readonly newTweetTimeout = TWEET_NEW_TWEET_TIMEOUT;

  imageHandler() {
    console.log('image handler');
  }

  reactionHandler() {
    console.log('reaction handler');
  }

  tweetingHandle() {
    if (!this.tweetContentControl.valid) {
      return;
    }

    const tweetuuidv4 = uuidv4();
    const content: string = this.tweetContentControl.value as string;
    this.#store.dispatch(
      FeatTweetActions.tweet({ uuid: tweetuuidv4, content })
    );

    this.tweettingInProgress.set(true);

    /** @todo @fixme likely it is better to refactor and move below outside of the method  */
    this.#actions
      .pipe(
        ofType(FeatTweetActions.tweetSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ uuid, tweet }) => {
        if (uuid === tweetuuidv4) {
          this.tweetContentControl.setValue('');

          this.tweet.set(tweet);
          this.tweettingInProgress.set(false);
          this.#showSuccessMessage(tweet);
        }
      });
  }

  successMessageClickHandler() {
    const tweet = this.tweet();

    if (tweet) {
      this.successMessageCloseHandler();
      this.#router.navigate([
        '/',
        APP_PATH.Profile,
        tweet.profileId,
        APP_PATH.Tweet,
        tweet.id,
      ]);
    }
  }

  successMessageCloseHandler() {
    this.tweet.set(null);
  }

  #showSuccessMessage(tweet: Tweety) {
    const content =
      tweet.content.length > 13
        ? tweet.content.slice(0, 10) + '...'
        : tweet.content;

    this.#messageService.add({
      severity: 'success',
      summary: 'Tweet posted :)',
      detail: content,
      data: tweet,
    });
  }
}
