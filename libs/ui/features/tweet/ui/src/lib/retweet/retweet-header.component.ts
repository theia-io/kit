import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { profilePicture } from '@kitouch/kit-data';
import { Profile, ReTweety } from '@kitouch/shared-models';
import { APP_PATH } from '@kitouch/ui-shared';

@Component({
  standalone: true,
  selector: 'feat-tweet-retweet-header',
  templateUrl: './retweet-header.component.html',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetweetHeaderComponent {
  currentProfileId = input.required<Profile['id'] | undefined>();
  tweet = input.required<ReTweety>();
  tweetProfile = input<Profile>();
  retweetProfile = input.required<Profile>();

  readonly profileUrlPath = `/${APP_PATH.Profile}/`;

  profilePic = profilePicture;
}