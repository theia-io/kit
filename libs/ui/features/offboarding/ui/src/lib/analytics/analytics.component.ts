import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FeatExpOffboardingAnalyticsActions,
  selectExpOffboardingAnalyticsById,
  selectExpOffboardingById,
} from '@kitouch/feat-offboarding-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import {
  AnalyticsEvent,
  ExpOffboarding,
  Profile,
} from '@kitouch/shared-models';
import { Store, select } from '@ngrx/store';
import { TooltipModule } from 'primeng/tooltip';
import { delay, filter, map, switchMap, take, withLatestFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-offboarding-analytics',
  templateUrl: './analytics.component.html',
  imports: [
    AsyncPipe,
    //
    TooltipModule,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatOffBoardingAnalyticsComponent {
  offboardingId = input.required<string>();
  /** Used by creator itself to preview KudoBoard without analytics */
  preview = input(false);

  #store = inject(Store);
  offboardingId$ = toObservable(this.offboardingId);

  offboarding$ = this.offboardingId$.pipe(
    switchMap((offboardingId) =>
      this.#store.pipe(select(selectExpOffboardingById(offboardingId)))
    )
  );
  offboardingAnalytics$ = this.offboardingId$.pipe(
    switchMap((offboardingId) =>
      this.#store.pipe(select(selectExpOffboardingAnalyticsById(offboardingId)))
    )
  );
  viewed$ = this.offboardingAnalytics$.pipe(
    map((analytics) =>
      analytics.filter(
        (analytic) => analytic.event === AnalyticsEvent.PageOpened
      )
    )
  );

  constructor() {
    this.offboardingId$
      .pipe(
        filter(Boolean),
        take(1),
        delay(2500),
        withLatestFrom(
          this.#store.pipe(select(selectCurrentProfile)),
          this.offboarding$
        ),
        takeUntilDestroyed()
      )
      .subscribe(([offboardingId, currentProfile, offboarding]) =>
        this.#visitorActions(
          offboardingId,
          currentProfile?.id == offboarding?.profileId,
          currentProfile?.id ?? ''
        )
      );
  }

  #visitorActions(
    offboardingId: ExpOffboarding['id'],
    owner: boolean,
    currentProfile: Profile['id']
  ) {
    if (this.preview() && owner) {
      // Only when it is current profile and its offboarding we consider
      // such users real previewers
      return;
    }

    this.#store.dispatch(
      FeatExpOffboardingAnalyticsActions.postAnalyticsExpOffboarding({
        analytics: {
          offboardingId,
          profileId: currentProfile,
          event: AnalyticsEvent.PageOpened,
        },
      })
    );
  }
}
