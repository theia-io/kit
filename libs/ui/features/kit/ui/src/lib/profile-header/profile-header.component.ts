import { Component, computed, inject, input } from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { FeatKitProfileSocialsComponent } from '../profile-socials/profile-socials.component';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  imports: [
    //
    FeatKitProfileSocialsComponent,
  ],
})
export class FeatKitProfileHeaderComponent {
  profile = input.required<Profile>();
  profilePic = computed(() => profilePicture(this.profile()));
}
