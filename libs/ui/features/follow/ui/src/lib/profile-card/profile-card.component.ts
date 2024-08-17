import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { FollowButtonComponent } from '@kitouch/ui-components';
import { ImageModule } from 'primeng/image';

@Component({
  standalone: true,
  selector: 'feat-follow-profile-card',
  templateUrl: './profile-card.component.html',
  imports: [
    ImageModule,
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
