import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FeatKudoBoardAnalyticsActions,
  selectKudoBoardAnalyticsById,
  selectKudoBoardById,
} from '@kitouch/data-kudoboard';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { KudoBoard, KudoBoardEvents, Profile } from '@kitouch/shared-models';
import { select, Store } from '@ngrx/store';
import { TooltipModule } from 'primeng/tooltip';
import { delay, filter, map, switchMap, take, withLatestFrom } from 'rxjs';

@Component({
  selector: 'feat-kudoboard-analytics',
  templateUrl: './analytics.component.html',
  imports: [
    AsyncPipe,
    //
    TooltipModule,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardAnalyticsComponent {
  kudoboardId = input.required<string>();
  /** Used by creator itself to preview KudoBoard without analytics */
  preview = input(false);

  #store = inject(Store);
  kudoboardId$ = toObservable(this.kudoboardId);

  kudoboard$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardById(kudoboardId))),
    ),
  );
  kudoboardAnalytics$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardAnalyticsById(kudoboardId))),
    ),
  );
  viewed$ = this.kudoboardAnalytics$.pipe(
    map((analytics) =>
      analytics.filter(
        (analytic) => analytic.event === KudoBoardEvents.PageOpened,
      ),
    ),
  );

  constructor() {
    this.kudoboardId$
      .pipe(
        takeUntilDestroyed(),
        filter(Boolean),
        take(1),
        delay(2500),
        withLatestFrom(this.#store.pipe(select(selectCurrentProfile))),
      )
      .subscribe(([kudoboardId, currentProfile]) =>
        this.#visitorActions(kudoboardId, currentProfile),
      );
  }

  #visitorActions(
    kudoBoardId: KudoBoard['id'],
    currentProfile: Profile | undefined,
  ) {
    if (this.preview() && currentProfile) {
      // Only when it is current profile and its kudoboard we consider
      // such users real previewers
      return;
    }

    this.#store.dispatch(
      FeatKudoBoardAnalyticsActions.postAnalyticsKudoBoard({
        analytics: {
          kudoBoardId,
          event: KudoBoardEvents.PageOpened,
        },
      }),
    );
  }
}
