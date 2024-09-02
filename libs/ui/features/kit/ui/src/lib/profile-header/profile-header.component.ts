import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { PhotoService } from '@kitouch/ui-shared';
import PhotoSwipe from 'photoswipe';
import { FeatKitProfileSocialsComponent } from '../profile-socials/profile-socials.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  imports: [
    NgOptimizedImage,
    //
    FeatKitProfileSocialsComponent,
  ],
})
export class FeatKitProfileHeaderComponent implements AfterViewInit {
  profile = input.required<Profile>();
  profilePic = computed(() => profilePicture(this.profile()));

  #photoService = inject(PhotoService);

  ngAfterViewInit(): void {
    const gallery = this.#photoService.initializeGallery({
      gallery: '#profile-header',
      children: 'a',
      pswpModule: PhotoSwipe,
    });

    console.log('FeatKitProfileHeaderComponent', gallery);
  }
}
