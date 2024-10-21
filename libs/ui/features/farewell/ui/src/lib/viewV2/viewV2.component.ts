import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FeatFarewellActions,
  selectFarewellAnalyticsById,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { FarewellAnalytics, Profile } from '@kitouch/shared-models';
import { DeviceService, PhotoService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import PhotoSwipe from 'photoswipe';
import { TooltipModule } from 'primeng/tooltip';
import { delay, filter, switchMap, take, withLatestFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-viewv2',
  templateUrl: './viewV2.component.html',
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    //
    TooltipModule,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellViewV2Component implements AfterViewInit {
  farewellId = input.required<string>();
  /** Used by creator itself to preview Farewell without analytics */
  preview = input(false);

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
  farewellAnalytics$ = this.#farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellAnalyticsById(farewellId)))
    ),
    filter(Boolean)
  );

  constructor() {
    this.farewell$
      .pipe(
        takeUntilDestroyed(),
        take(1),
        delay(2500),

        withLatestFrom(
          this.farewellAnalytics$,
          this.#store.pipe(select(selectCurrentProfile))
        )
      )
      .subscribe(([farewell, analytics, currentProfile]) =>
        this.#visitorActions(farewell.profile, analytics, currentProfile)
      );
  }

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

  #visitorActions(
    farewellProfile: Profile,
    analytics: FarewellAnalytics,
    currentProfile: Profile | undefined
  ) {
    if (
      this.preview() &&
      currentProfile &&
      farewellProfile.id === currentProfile.id
    ) {
      // Only when it is current profile and its farewell we consider
      // such users real previewers
      return;
    }

    this.#store.dispatch(
      FeatFarewellActions.putAnalyticsFarewell({
        analytics: {
          ...analytics,
          viewed: analytics.viewed + 1,
        },
      })
    );
  }
}
