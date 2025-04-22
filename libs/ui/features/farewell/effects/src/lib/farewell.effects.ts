import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { FarewellV2Service } from './farewellV2.service';
import { Farewell } from '@kitouch/shared-models';

@Injectable()
export class FarewellEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  #farewellService = inject(FarewellV2Service);
  #currentProfile = this.#store.pipe(
    select(selectCurrentProfile),
    filter((profile) => !!profile)
  );

  getFarewells$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getProfileFarewells),
      switchMap(({ profileId }) =>
        this.#farewellService.getFarewells(profileId)
      ),
      map((farewells) =>
        FeatFarewellActions.getFarewellsSuccess({ farewells })
      ),
      catchError(() =>
        of(
          FeatFarewellActions.getFarewellsFailure({
            message:
              'It is not you, it is us. Cannot load profile farewells, try again later.',
          })
        )
      )
    )
  );

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

  createFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.createFarewell),
      withLatestFrom(this.#currentProfile),
      switchMap(([{ farewell }, profile]) =>
        this.#farewellService.createFarewell({
          ...farewell,
          profileId: profile.id,
          profile,
        })
      ),
      map((farewell) => FeatFarewellActions.createFarewellSuccess({ farewell }))
    )
  );
  //to here
  putFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.putFarewell),
      tap((v) => console.log('TEST UPDATINNG', v)),
      switchMap(({ farewell }) =>
        this.#farewellService.putFarewell(farewell).pipe(
          map((farewell) =>
            FeatFarewellActions.putFarewellSuccess({ farewell })
          ),
          catchError((err) =>
            of(
              FeatFarewellActions.putFarewellFailure({
                message: `Failed to update farewell. Try again later or contact support. ${err.message}`,
              })
            )
          )
        )
      )
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

  /** Analytics */

  createAnalyticsFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.createFarewellSuccess),
      switchMap(({ farewell: { id } }) =>
        this.#farewellService.postAnalyticsFarewell(id)
      ),
      map((analytics) =>
        analytics
          ? FeatFarewellActions.postAnalyticsFarewellSuccess({ analytics })
          : FeatFarewellActions.postAnalyticsFarewellFailure({
              message:
                'We were not able to create farewell analytics. Let us know so we can get it fixed for you. Otherwise no analytics will be available for created farewell.',
            })
      )
    )
  );

  deleteFarewellAnalytics$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.deleteFarewellSuccess),
      switchMap(({ id }) =>
        this.#farewellService.deleteAnalyticsFarewell(id).pipe(
          map((deleted) =>
            deleted
              ? FeatFarewellActions.deleteAnalyticsFarewellSuccess({ id })
              : FeatFarewellActions.deleteAnalyticsFarewellFailure({
                  message:
                    'Farewell analytics were not deleted. Reach out to support.',
                })
          ),
          catchError((err) =>
            of(
              FeatFarewellActions.deleteAnalyticsFarewellFailure({
                message:
                  'Network issue, did not delete farewell analytics. Reach out to support.',
              })
            )
          )
        )
      )
    )
  );

  getAnalyticsFarewells$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getFarewellsSuccess),
      switchMap(({ farewells }) =>
        this.#farewellService.getAnalyticsFarewells(
          farewells.map(({ id }) => id)
        )
      ),
      map((analytics) =>
        FeatFarewellActions.getAllAnalyticsSuccess({ analytics })
      )
    )
  );

  getAnalyticsFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getAnalyticsFarewell),
      switchMap(({ farewellId }) =>
        this.#farewellService.getAnalyticsFarewell(farewellId)
      ),
      map((analytics) =>
        analytics
          ? FeatFarewellActions.getAnalyticsFarewellSuccess({ analytics })
          : FeatFarewellActions.getAnalyticsFarewellFailure({
              message: 'Analytics for this farewell was not find',
            })
      )
    )
  );

  putAnalyticsFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.putAnalyticsFarewell),
      switchMap(({ analytics }) =>
        this.#farewellService.putAnalytics(analytics).pipe(
          map((analytics) =>
            FeatFarewellActions.putAnalyticsFarewellSuccess({
              analytics: analytics as any,
            })
          )
        )
      )
    )
  );
}
