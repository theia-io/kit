import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';

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

  getFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getFarewell),
      switchMap(({ id }) => this.#farewellService.getFarewell(id)),
      map((farewell) =>
        farewell
          ? FeatFarewellActions.getFarewellSuccess({ farewell })
          : FeatFarewellActions.getFarewellFailure({
              message: 'Did not find this farewell.',
            })
      )
    )
  );

  getFarewells$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getProfileFarewells),
      switchMap(({ profileId }) =>
        this.#farewellService.getFarewells(profileId)
      ),
      map((farewells) => FeatFarewellActions.getFarewellsSuccess({ farewells }))
    )
  );

  createFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.createFarewell),
      withLatestFrom(this.#currentProfile),
      switchMap(([{ title, content }, profile]) =>
        this.#farewellService.createFarewell({ profile, title, content })
      ),
      map((farewell) => FeatFarewellActions.createFarewellSuccess({ farewell }))
    )
  );

  putFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.putFarewell),
      switchMap(({ farewell }) => this.#farewellService.putFarewell(farewell)),
      map((farewell) => FeatFarewellActions.putFarewellSuccess({ farewell }))
    )
  );
}
