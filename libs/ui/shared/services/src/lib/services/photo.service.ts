import { Injectable } from '@angular/core';
import { onDemandCSS } from '@kitouch/shared-infra';
import { PreparedPhotoSwipeOptions } from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

/**
 * Initiate lightbox Gallery
 * Docs: https://photoswipe.com/getting-started/
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  /** Docs: https://photoswipe.com/getting-started/
   */
  @onDemandCSS({ name: 'photoswipe', path: '/photoswipe.css' })
  async initializeGallery(options: Partial<PreparedPhotoSwipeOptions>) {
    const lightBox = new PhotoSwipeLightbox(options);
    lightBox.init();

    return lightBox;
  }

  // uncomment and test in `FeatFarewellViewV2Component` `ngAfterViewInit` method - does not work and silently fails
  // @onDemandCSS({ name: 'photoswipe', path: '/photoswipe.css' })
  // async createGallery(options: Partial<PreparedPhotoSwipeOptions>) {
  //   console.log('\n\ncreateGallery:', options);
  //   const lightBox = new PhotoSwipeLightbox(options);
  //   console.log('\n\ncreateGallery 1:', lightBox);

  //   return lightBox;
  // }
}
