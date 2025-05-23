import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  profilePicture,
  profilePictureDimensions,
  selectProfileFollowers,
} from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { UiKitColorDisplayerComponent } from '@kitouch/ui-components';

import { AuthorizedFeatureDirective } from '@kitouch/containers';
import { APP_PATH } from '@kitouch/shared-constants';
import { PhotoService } from '@kitouch/shared-services';
import PhotoSwipe from 'photoswipe';
import { FeatKitProfileSocialsComponent } from '../profile-socials/profile-socials.component';
import { Store } from '@ngrx/store';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  imports: [
    NgOptimizedImage,
    RouterModule,
    //
    UiKitColorDisplayerComponent,
    FeatKitProfileSocialsComponent,
    AuthorizedFeatureDirective,
  ],
})
export class FeatKitProfileHeaderComponent implements AfterViewInit {
  profile = input.required<Profile>();

  #store = inject(Store);
  #photoService = inject(PhotoService);

  #profile$ = toObservable(this.profile);
  #profileFollowers = toSignal(
    this.#profile$.pipe(
      switchMap((profile) =>
        this.#store.select(selectProfileFollowers(profile.id))
      )
    )
  );
  profileNetwork = computed(() => {
    const followers = this.#profileFollowers();
    const following = this.profile().following;

    const networkUniqueProfiles = new Set<string>([
      ...(following?.map((f) => f.id) ?? []),
      ...(followers?.map((f) => f.id) ?? []),
    ]);

    return networkUniqueProfiles.size ?? 0;
  });

  profilePic = computed(() => profilePicture(this.profile()));
  profilePicDimensions = computed(() =>
    profilePictureDimensions(this.profile())
  );

  readonly profileUrl = `/${APP_PATH.Profile}/`;

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
