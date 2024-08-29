import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';

import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { S3_FAREWELL_BUCKET_BASE_URL } from '@kitouch/ui-shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { FarewellService } from './farewell.service';

@Injectable()
export class FarewellEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  #farewellService = inject(FarewellService);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  #currentProfile = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  getFarewells$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getProfileFarewells),
      switchMap(({ profileId }) =>
        this.#farewellService.getFarewells(profileId)
      ),
      map((farewells) => FeatFarewellActions.getFarewellsSuccess({ farewells }))
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

  /** Media */
  uploadFarewellStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.uploadFarewellStorageMedia),
      switchMap(({ farewellId, profileId, items }) =>
        forkJoin([
          items.map(({ key, blob }) =>
            this.#farewellService.uploadFarewellMedia(key, blob)
          ),
        ]).pipe(
          map(() =>
            FeatFarewellActions.uploadFarewellStorageMediaSuccess({
              farewellId,
              profileId,
              items,
            })
          ),
          catchError(() =>
            of(
              FeatFarewellActions.uploadFarewellStorageMediaFailure({
                message:
                  'We were unable to upload farewell media. Try adding later.',
              })
            )
          )
        )
      )
    )
  );

  createMediasFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.uploadFarewellStorageMediaSuccess),
      switchMap(({ farewellId, profileId, items }) =>
        this.#farewellService.postMediasFarewell(
          items.map((item) => ({
            farewellId,
            profileId,
            url: `${this.#s3FarewellBaseUrl}/${item.key}`,
          }))
        )
      ),
      map((medias) =>
        medias
          ? FeatFarewellActions.postMediasFarewellSuccess({ medias })
          : FeatFarewellActions.postMediasFarewellFailure({
              message:
                'We were not able to add uploaded media to your farewell. Try contacting support.',
            })
      )
    )
  );

  getMediasFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getFarewellSuccess),
      switchMap(({ farewell: { id } }) =>
        this.#farewellService.getMediasFarewell(id).pipe(
          map((medias) =>
            FeatFarewellActions.getMediasFarewellSuccess({
              medias: medias ?? [],
            })
          ),
          catchError(() => {
            console.error('[FarewellEffects][getMediasFarewell] network error');
            return of(
              FeatFarewellActions.getMediasFarewellFailure({
                message: 'Error getting farewell media files. Try later.',
              })
            );
          })
        )
      )
    )
  );

  // getMediasFarewells$ = createEffect(() =>
  //   this.#actions$.pipe(
  //     ofType(FeatFarewellActions.getFarewellsSuccess),
  //     switchMap(({farewells}) =>
  //       this.#farewellService.getMediasFarewells(farewells.map(({id}) => id)).pipe(
  //         map((medias) =>
  //           FeatFarewellActions.getMediasFarewellSuccess({
  //             medias: medias ?? [],
  //           })
  //         ),
  //         catchError(() => {
  //           console.error(
  //             '[FarewellEffects][getMediasFarewells] network error'
  //           );
  //           return of(
  //             FeatFarewellActions.getMediasFarewellFailure({
  //               message: 'Error getting farewells media files. Try later.',
  //             })
  //           );
  //         })
  //       )
  //     )
  //   )
  // );

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
        this.#farewellService.putAnalytics(analytics)
      ),
      map((analytics) =>
        FeatFarewellActions.putAnalyticsFarewellSuccess({ analytics })
      )
    )
  );
}
