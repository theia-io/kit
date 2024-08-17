import { Component, computed, input } from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { ImageModule } from 'primeng/image';
import { FeatKitProfileSocialsComponent } from '../profile-socials/profile-socials.component';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  imports: [
    //
    ImageModule,
    //
    FeatKitProfileSocialsComponent,
  ],
})
export class FeatKitProfileHeaderComponent {
  profile = input.required<Profile>();
  profilePic = computed(() => profilePicture(this.profile()));
}
