import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeatTweetActions } from '@kitouch/feat-tweet-data';
import { TweetButtonComponent } from '@kitouch/ui/components';
import { AuthService } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'feat-tweeting',
  templateUrl: './tweeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    //
    TweetButtonComponent,
  ],
})
export class FeatTweetTweetingComponent {
  #auth = inject(AuthService);
  #store = inject(Store);

  profilePic$ = this.#auth.currentProfile$.pipe(
    map((profiles) => profiles?.pictures?.[0]?.url)
  );

  tweetContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  tweetingHandle() {
    if (!this.tweetContentControl.valid) {
      return;
    }

    const content: string = this.tweetContentControl.value as string;
    this.#store.dispatch(FeatTweetActions.create({ content }));
  }
}
