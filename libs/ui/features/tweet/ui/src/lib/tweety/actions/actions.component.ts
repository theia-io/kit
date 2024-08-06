import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  standalone: true,
  selector: 'feat-tweet-actions',
  templateUrl: `actions.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    //
    OverlayPanelModule,
    ButtonModule,
    //
  ],
})
export class FeatTweetActionsComponent {
  tweetUrl = input.required<string>();
  comments = input(0);
  retweetsAndQuotes = input(0);
  likes = input(0);
  liked = input<boolean | null | undefined>(false);
  bookmarked = input(false);

  comment = output<Event>();
  retweet = output<void>();
  quote = output<void>();
  like = output<void>();
  bookmark = output<void>();

  copied = signal(false);

  copyToClipBoard() {
    navigator.clipboard.writeText(this.tweetUrl());
    this.copied.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.copied.set(false);
    }, 5000);
  }
}
