import { NgOptimizedImage, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { APP_PATH, PhotoService } from '@kitouch/ui-shared';
import PhotoSwipe from 'photoswipe';
import { FeatKitProfileSocialsComponent } from '../profile-socials/profile-socials.component';
import { FeatKitProfileBackgroundComponent } from '../profile-background/profile-background.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  imports: [
    NgOptimizedImage,
    NgStyle,
    RouterModule,
    //
    FeatKitProfileBackgroundComponent,
    FeatKitProfileSocialsComponent,
  ],
})
export class FeatKitProfileHeaderComponent implements AfterViewInit {
  profile = input.required<Profile>();
  profilePic = computed(() => profilePicture(this.profile()));

  #photoService = inject(PhotoService);

  readonly profileUrl = `/${APP_PATH.Profile}`;

  ngAfterViewInit(): void {
    this.#photoService.initializeGallery({
      gallery: '#profile-header',
      children: 'a',
      pswpModule: PhotoSwipe,
    });

    this.#photoService.initializeGallery({
      gallery: '#profile-background',
      children: 'a',
      pswpModule: PhotoSwipe,
    });
  }
}
