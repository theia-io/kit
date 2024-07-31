import { Injectable, inject } from '@angular/core';
import {
    selectCurrentProfile
} from '@kitouch/kit-data';

import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs';
import { FarewellService } from './farewell.service';

@Injectable()
export class FarewellEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #farewellService = inject(FarewellService);

  #currentProfile = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  createFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.createFarewell),
      withLatestFrom(this.#currentProfile),
      switchMap(([{ content }, profile]) =>
        this.#farewellService.createFarewell(profile.id, content)
      ),
      map((farewell) => FeatFarewellActions.createFarewellSuccess({ farewell }))
    )
  );
}
