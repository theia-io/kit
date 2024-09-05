import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { FollowButtonComponent } from '@kitouch/ui-components';
import { PhotoService } from '@kitouch/ui-shared';
import PhotoSwipe from 'photoswipe';

@Component({
  standalone: true,
  selector: 'feat-follow-profile-card',
  templateUrl: './profile-card.component.html',
  imports: [
    NgOptimizedImage,
    //
    FollowButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFollowProfileCardComponent implements AfterViewInit {
  profile = input.required<Profile>();
  followed = input<boolean>(false);
  followProfile = output<Profile>();
  stopFollowProfile = output<Profile>();

  profilePic = computed(() => profilePicture(this.profile()));

  #photoService = inject(PhotoService);

  ngAfterViewInit(): void {
    this.#photoService.initializeGallery({
      gallery: '#profile-header',
      children: 'a',
      pswpModule: PhotoSwipe,
    });
  }
}
