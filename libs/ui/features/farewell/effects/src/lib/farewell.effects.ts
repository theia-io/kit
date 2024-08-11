import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';

import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
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

  deleteFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.deleteFarewell),
      switchMap(({ id }) =>
        this.#farewellService.deleteFarewell(id).pipe(
          map((deleted) =>
            deleted
              ? FeatFarewellActions.deleteFarewellSuccess({ id })
              : FeatFarewellActions.deleteFarewellFailure({
                  message:
                    'It seems this farewell cannot be deleted. Please, get in touch with us.',
                })
          ),
          catchError(() =>
            of(
              FeatFarewellActions.deleteFarewellFailure({
                message:
                  'We were unable to delete farewell. It is not you, its us. Try again later or contact us directly',
              })
            )
          )
        )
      )
    )
  );
}
