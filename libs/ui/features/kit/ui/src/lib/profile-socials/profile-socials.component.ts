import { Component, input } from '@angular/core';
import { Profile } from '@kitouch/shared-models';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-socials',
  templateUrl: './profile-socials.component.html',
  imports: [],
})
export class FeatKitProfileSocialsComponent {
  socials = input.required<Profile['socials']>();
}
