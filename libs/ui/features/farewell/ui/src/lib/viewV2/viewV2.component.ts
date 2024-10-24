import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { selectFarewellById } from '@kitouch/feat-farewell-data';
import { DeviceService, PhotoService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import PhotoSwipe from 'photoswipe';
import { filter, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-viewv2',
  templateUrl: './viewV2.component.html',
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellViewV2Component implements AfterViewInit {
  farewellId = input.required<string>();

  #store = inject(Store);
  sanitizer = inject(DomSanitizer);
  #photoService = inject(PhotoService);
  device$ = inject(DeviceService).device$;

  #farewellId$ = toObservable(this.farewellId).pipe(filter(Boolean));
  farewell$ = this.#farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellById(farewellId)))
    ),
    filter(Boolean)
  );

  ngAfterViewInit() {
    setTimeout(async () => {
      await this.#photoService.initializeGallery({
        gallery: '#farewell-images',
        children: 'a',
        pswpModule: PhotoSwipe,
      });
    }, 2500);

    // setTimeout(async () => {
    //   const gallery = await this.#photoService.createGallery({
    //     gallery: '#farewell-images',
    //     children: 'a',
    //     pswpModule: PhotoSwipe,
    //   });

    //   setTimeout(() => {
    //     console.log('FeatFarewellViewV2Component init');
    //     gallery.init();
    //   }, 1000)
    // }, 2000)

    // console.log('FeatFarewellViewV2Component',gallery);
  }
}
