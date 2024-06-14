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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FeatTweetActions } from '@kitouch/feat-tweet-data';
import { TweetButtonComponent } from '@kitouch/ui/components';
import { APP_PATH, AuthService } from '@kitouch/ui/shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { FeatTweetTweetingActionsComponent } from './actions/actions.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweeting',
  templateUrl: './tweeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatSnackBarModule,
    //
    TweetButtonComponent,
    FeatTweetTweetingActionsComponent,
  ],
})
export class FeatTweetTweetingComponent {
  #destroyRef = inject(DestroyRef);
  #actions = inject(Actions);
  #router = inject(Router);

  #auth = inject(AuthService);
  #store = inject(Store);
  #snackBar = inject(MatSnackBar);

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
  
  tweettingInProgress = signal(false);

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

          this.tweettingInProgress.set(false);
          const snackBarRef = this.#snackBar.open('Posted!', 'See it');
          snackBarRef.onAction().subscribe(() => {
            console.log(APP_PATH.Tweets, tweet.id);
            this.#router.navigate(['/', APP_PATH.Tweets, tweet.id]);
          });
        }
      });
  }
}
