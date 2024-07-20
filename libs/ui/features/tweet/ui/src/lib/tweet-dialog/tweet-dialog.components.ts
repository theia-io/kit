import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    HostListener,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeatTweetActions } from '@kitouch/features/tweet/data';
import { OUTLET_DIALOG } from '@kitouch/ui/shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  standalone: true,
  selector: 'feat-tweet-dialog',
  templateUrl: './tweet-dialog.components.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    DialogModule,
    ButtonModule,
  ],
})
export class FeatTweetDialogComponent {
  #destroyRef = inject(DestroyRef);
  #actions = inject(Actions);
  #router = inject(Router);
  #store = inject(Store);

  @HostListener('window:keydown.enter', ['$event'])
  keyDownEnterHandler() {
    this.tweetingHandle();
  }

  tweetuuidv4 = signal('');
  visible = signal(true);
  tweettingInProgress = signal(false);

  tweetContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  placeholderText = `Share anything:
  - got an idea to share?
  - got a new certification?
  - got a new job?
  - wrote an article or looking for collaborators?
  - looking for a open-source projects to join?`;

  constructor() {
    this.#actions
      .pipe(
        ofType(FeatTweetActions.tweetFailure),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ uuid }) => {
        if (uuid === this.tweetuuidv4()) {
          this.tweettingInProgress.set(false);
          // @TODO Implement error message that
          // we got an error ON OUR side and we will try better next time
          // and now we need ~X time to fix this issue. Try to tweet from
          // other place or safe as a draft meanwhile?
        }
      });
  }

  tweetingHandle() {
    if (!this.tweetContentControl.valid) {
      return;
    }

    this.tweetuuidv4.set(uuidv4());

    const content: string = this.tweetContentControl.value as string;
    this.#store.dispatch(
      FeatTweetActions.tweet({ uuid: this.tweetuuidv4(), content })
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
        if (uuid === this.tweetuuidv4()) {
          this.tweetContentControl.setValue('');
          this.tweetuuidv4.set('');
          this.tweettingInProgress.set(false);
          this.onDialogFinalizeCb();
        }
      });
  }

  onDialogFinalizeCb() {
    this.#router.navigate([{ outlets: { [OUTLET_DIALOG]: null } }]);
  }
}
