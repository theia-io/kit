import {
  AsyncPipe,
  CommonModule,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeatTweetActions } from '@kitouch/feat-tweet-data';
import { selectProfilePicture } from '@kitouch/kit-data';
import { UiKitTweetButtonComponent } from '@kitouch/ui-components';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { TWEET_CONTROL_INITIAL_ROWS } from '../tweet-control/constants';
import { FeatTweetTweetingActionsComponent } from './actions/actions.component';
import { DeviceService } from '@kitouch/shared-infra';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweeting',
  templateUrl: './tweeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgClass,
    NgOptimizedImage,
    ReactiveFormsModule,
    //
    FloatLabelModule,
    InputTextareaModule,
    // ToastModule,
    //
    UiKitTweetButtonComponent,
    FeatTweetTweetingActionsComponent,
  ],
  // providers: [MessageService],
})
export class FeatTweetTweetingComponent {
  #destroyRef = inject(DestroyRef);
  #actions = inject(Actions);
  #store = inject(Store);
  deviceService = inject(DeviceService);
  // #messageService = inject(MessageService);
  // #snackBar = inject(MatSnackBar);

  @HostListener('window:keydown', ['$event'])
  keyDownEnterHandler(event: KeyboardEvent) {
    if (
      this.tweetContentControl.valid &&
      event.key === 'Enter' &&
      (event.metaKey || event.ctrlKey) // Check for Cmd/Ctrl key
    ) {
      this.tweetingHandle();
    }
  }

  @ViewChild('textControl')
  textControlTmp: ElementRef<HTMLTextAreaElement>;

  profilePic$ = this.#store.select(selectProfilePicture);

  tweetContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);
  tweetContentControlRows = TWEET_CONTROL_INITIAL_ROWS;
  // tweet = signal<Tweety | null>(null);
  tweettingInProgress = signal(false);

  imageHandler() {
    console.info('[UI FeatTweetTweetingComponent] image handler');
  }

  reactionHandler() {
    console.info('[UI FeatTweetTweetingComponent] reaction handler');
  }

  tweetControlBlur() {
    if (!this.tweetContentControl.value?.length) {
      this.tweetContentControlRows = TWEET_CONTROL_INITIAL_ROWS;
      return;
    }
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

    /** @todo @fixme likely it is better to refactor and move below outside of the method or move
     * altogether to some sort of effect that handles notifications?
     */
    this.#actions
      .pipe(
        ofType(FeatTweetActions.tweetSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ uuid }) => {
        if (uuid === tweetuuidv4) {
          this.tweetContentControl.reset();
          this.textControlTmp.nativeElement.blur();

          // this.tweet.set(tweet);
          this.tweettingInProgress.set(false);
          this.tweetContentControlRows = TWEET_CONTROL_INITIAL_ROWS;
          // this.#showSuccessMessage(tweet);
        }
      });
  }

  // successMessageClickHandler() {
  //   const tweet = this.tweet();

  //   if (tweet) {
  //     this.successMessageCloseHandler();
  //     this.#router.navigate([
  //       '/',
  //       APP_PATH.Profile,
  //       tweet.profileId,
  //       APP_PATH.Tweet,
  //       tweet.id,
  //     ]);
  //   }
  // }

  // successMessageCloseHandler() {
  //   this.tweet.set(null);
  // }

  // #showSuccessMessage(tweet: Tweety) {
  //   const content =
  //     tweet.content.length > 13
  //       ? tweet.content.slice(0, 10) + '...'
  //       : tweet.content;

  //   this.#messageService.add({
  //     severity: 'success',
  //     summary: 'Tweet posted :)',
  //     detail: content,
  //     data: tweet,
  //   });
  // }
}
