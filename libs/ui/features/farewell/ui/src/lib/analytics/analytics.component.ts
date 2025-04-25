import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FeatFarewellActions,
  selectFarewellAnalyticsById,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { FarewellAnalytics, Profile } from '@kitouch/shared-models';
import { select, Store } from '@ngrx/store';
import { TooltipModule } from 'primeng/tooltip';
import {
  combineLatest,
  delay,
  filter,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-analytics',
  templateUrl: './analytics.component.html',
  imports: [
    AsyncPipe,
    //
    TooltipModule,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellAnalyticsComponent {
  farewellId = input.required<string>();
  /** Used by creator itself to preview Farewell without analytics */
  preview = input(false);

  #store = inject(Store);
  farewellId$ = toObservable(this.farewellId);

  farewell$ = this.farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellById(farewellId)))
    )
  );
  farewellAnalytics$ = this.farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellAnalyticsById(farewellId)))
    )
  );

  constructor() {
    combineLatest([
      this.farewell$.pipe(filter(Boolean)),
      this.farewellAnalytics$.pipe(filter(Boolean)),
    ])
      .pipe(
        takeUntilDestroyed(),
        take(1),
        delay(2500),
        withLatestFrom(this.#store.pipe(select(selectCurrentProfile)))
      )
      .subscribe(([[farewell, analytics], currentProfile]) =>
        this.#visitorActions(farewell.profileId, analytics, currentProfile)
      );
  }

  #visitorActions(
    farewellProfileId: Profile['id'],
    analytics: FarewellAnalytics,
    currentProfile: Profile | undefined
  ) {
    if (
      this.preview() &&
      currentProfile &&
      farewellProfileId === currentProfile.id
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
