import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatTweetCommentComponent {}
