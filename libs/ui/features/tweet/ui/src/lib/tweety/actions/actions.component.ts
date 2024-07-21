import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  standalone: true,
  selector: 'feat-tweet-actions',
  templateUrl: `actions.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OverlayPanelModule],
})
export class FeatTweetActionsComponent {
  @Input({ required: true })
  tweetUrl: string;

  @Input()
  comments = 0;

  @Input()
  repostsAndQuotes = 0;

  @Input()
  likes = 0;

  @Input()
  liked: boolean | null | undefined = false;

  @Input()
  bookmarked = false;

  @Output()
  comment = new EventEmitter<Event>();

  @Output()
  repost = new EventEmitter<void>();

  @Output()
  quote = new EventEmitter<void>();

  @Output()
  like = new EventEmitter<void>();

  @Output()
  bookmark = new EventEmitter<void>();

  copied = signal(false);

  copyToClipBoard() {
    navigator.clipboard.writeText(this.tweetUrl);
    this.copied.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
        this.copied.set(false);
    }, 5000);
  }
}
