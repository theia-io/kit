import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageModule } from 'primeng/image';
import {
  FarewellFullView,
  FeatFarewellActions,
  selectFarewellFullViewById,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { DeviceService, PhotoService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { TooltipModule } from 'primeng/tooltip';
import {
  delay,
  distinctUntilKeyChanged,
  filter,
  map,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import PhotoSwipe from 'photoswipe';

@Component({
  standalone: true,
  selector: 'feat-farewell-viewv2',
  templateUrl: './viewV2.component.html',
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    //
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellViewV2Component implements AfterViewInit {
  farewellId = input<string>();
  preview = input(false);
  visible = input<Array<'media' | 'analytics' | 'chat'>>([
    'media',
    'analytics',
  ]);

  farewell = output<FarewellFullView>();
  profile = output<Profile>();

  #store = inject(Store);
  sanitizer = inject(DomSanitizer);
  #photoService = inject(PhotoService);
  device$ = inject(DeviceService).device$;

  #farewellId$ = toObservable(this.farewellId).pipe(filter(Boolean));

  farewell$ = this.#farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellFullViewById(farewellId)))
    ),
    filter(Boolean)
  );

  constructor() {
    this.farewell$
      .pipe(takeUntilDestroyed(), distinctUntilKeyChanged('id'))
      .subscribe((farewell) => this.farewell.emit(farewell));

    this.farewell$
      .pipe(
        takeUntilDestroyed(),
        map(({ profile }) => profile),
        distinctUntilKeyChanged('id')
      )
      .subscribe((profile) => this.profile.emit(profile));

    this.farewell$
      .pipe(
        takeUntilDestroyed(),
        take(1),
        delay(2500),
        switchMap(({ id }) =>
          this.#store.pipe(
            select(selectFarewellFullViewById(id)),
            take(1),
            filter(Boolean)
          )
        ),
        withLatestFrom(this.#store.pipe(select(selectCurrentProfile)))
      )
      .subscribe(([farewell, currentProfile]) =>
        this.#visitorActions(farewell, currentProfile)
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
    farewell: FarewellFullView,
    currentProfile: Profile | undefined
  ) {
    if (
      this.preview() &&
      currentProfile &&
      farewell.profile.id === currentProfile.id
    ) {
      // Only when it is current profile and its farewell we consider
      // such users real previewers
      return;
    }

    if (farewell.analytics) {
      this.#store.dispatch(
        FeatFarewellActions.putAnalyticsFarewell({
          analytics: {
            ...farewell.analytics,
            viewed: farewell.analytics.viewed + 1,
          },
        })
      );
    } else {
      console.error(
        '[ERROR] This should never happen and now has to be fixed manually.'
      );
    }
  }
}
