import { Injectable } from '@angular/core';
import * as Masonry from 'masonry-layout';

const DEFAULT_MASONRY: Partial<Masonry.Options> = {
  itemSelector: '.masonry-item',
  fitWidth: true,
};

@Injectable({ providedIn: 'root' })
export class MasonryService {
  /** Docs: https://photoswipe.com/getting-started/
   */
  async initializeMasonry(
    el: HTMLElement | string,
    options?: Partial<Masonry.Options>,
  ) {
    const masonry = new Masonry(el, {
      ...DEFAULT_MASONRY,
      ...options,
    });
    return masonry;
  }
}
