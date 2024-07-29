import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    output
} from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { FollowButtonComponent } from '@kitouch/ui-components';

@Component({
  standalone: true,
  selector: 'feat-follow-profile-card',
  templateUrl: './profile-card.component.html',
  imports: [
    CommonModule,
    //
    //
    FollowButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFollowProfileCardComponent {
  profile = input.required<Profile>();
  followed = input<boolean>(false);
  followProfile = output<Profile>();
  stopFollowProfile = output<Profile>();

  profilePic = computed(() => profilePicture(this.profile()));
}
