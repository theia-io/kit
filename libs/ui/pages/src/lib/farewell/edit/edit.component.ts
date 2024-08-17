import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  FeatFarewellActions,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
import { FeatFarewellGenerateComponent } from '@kitouch/feat-farewell-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-farewell-all',
  templateUrl: './edit.component.html',
  imports: [
    AsyncPipe,
    //
    FeatFarewellGenerateComponent,
  ],
})
export class PageFarewellEditComponent {
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    filter(Boolean),
    shareReplay()
  );

  farewell$ = this.farewellId$.pipe(
    switchMap((id) => this.#store.pipe(select(selectFarewellById(id)))),
    filter(Boolean)
  );

  currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter(Boolean)
  );

  farewellCreator$ = combineLatest([this.farewell$, this.currentProfile$]).pipe(
    map(([farewell, profile]) => farewell.profile.id === profile.id),
    startWith(false)
  );

  constructor() {
    this.farewellId$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.#store.dispatch(FeatFarewellActions.getFarewell({ id }))
      );
  }
}
