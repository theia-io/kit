import { Injectable, inject } from '@angular/core';

import {
  FeatFarewellActions,
  FeatFarewellMediaActions,
} from '@kitouch/feat-farewell-data';
import { S3_FAREWELL_BUCKET_BASE_URL } from '@kitouch/ui-shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { FarewellService } from './farewell.service';

const getFullUrl = (s3Url: string, key: string) => `${s3Url}/${key}`;
const getKeyFromUrl = (url: string, s3Url: string) =>
  url.replace(`${s3Url}/`, '');

@Injectable()
export class FarewellMediaEffects {
  #actions$ = inject(Actions);

  #farewellService = inject(FarewellService);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  uploadFarewellStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellMediaActions.uploadFarewellStorageMedia),
      switchMap(({ farewellId, profileId, items }) =>
        forkJoin([
          items.map(({ key, blob }) =>
            this.#farewellService.uploadFarewellMedia(key, blob)
          ),
        ]).pipe(
          map(() =>
            FeatFarewellMediaActions.uploadFarewellStorageMediaSuccess({
              farewellId,
              profileId,
              items,
            })
          ),
          catchError(() =>
            of(
              FeatFarewellMediaActions.uploadFarewellStorageMediaFailure({
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
      ofType(FeatFarewellMediaActions.uploadFarewellStorageMediaSuccess),
      switchMap(({ farewellId, profileId, items }) =>
        this.#farewellService.postMediasFarewell(
          items.map((item) => ({
            farewellId,
            profileId,
            url: getFullUrl(this.#s3FarewellBaseUrl, item.key),
          }))
        )
      ),
      map((medias) =>
        medias
          ? FeatFarewellMediaActions.postMediasFarewellSuccess({ medias })
          : FeatFarewellMediaActions.postMediasFarewellFailure({
              message:
                'We were not able to add uploaded media to your farewell. Try contacting support.',
            })
      )
    )
  );

  deleteFarewellStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellMediaActions.deleteFarewellStorageMedia),
      switchMap(({ url }) =>
        this.#farewellService
          .deleteFarewellMedia(getKeyFromUrl(url, this.#s3FarewellBaseUrl))
          .pipe(
            map(() =>
              FeatFarewellMediaActions.deleteFarewellStorageMediaSuccess({
                url,
              })
            ),
            catchError(() =>
              of(
                FeatFarewellMediaActions.deleteFarewellStorageMediaFailure({
                  message:
                    'We were unable to remove farewell media from S3 bucket. Try again later.',
                })
              )
            )
          )
      )
    )
  );

  deleteMediaFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellMediaActions.deleteMediaFarewell),
      switchMap(({ id }) =>
        this.#farewellService.deleteMediaFarewell(id).pipe(
          map(() =>
            FeatFarewellMediaActions.deleteMediaFarewellSuccess({
              id,
            })
          ),
          catchError(() =>
            of(
              FeatFarewellMediaActions.deleteMediaFarewellFailure({
                message:
                  'We were unable to remove farewell media. Try again later.',
              })
            )
          )
        )
      )
    )
  );

  getMediasFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getFarewellSuccess),
      switchMap(({ farewell: { id } }) =>
        this.#farewellService.getMediasFarewell(id).pipe(
          map((medias) =>
            FeatFarewellMediaActions.getMediasFarewellSuccess({
              medias: medias ?? [],
            })
          ),
          catchError(() => {
            console.error('[FarewellEffects][getMediasFarewell] network error');
            return of(
              FeatFarewellMediaActions.getMediasFarewellFailure({
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
}
