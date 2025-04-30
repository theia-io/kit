import { Injectable, inject } from '@angular/core';

import { FeatFarewellMediaActions } from '@kitouch/feat-farewell-data';
import { S3_FAREWELL_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, forkJoin, map, of, switchMap } from 'rxjs';
import { FarewellMediaService } from './farewell-media.service';

export const getFullS3Url = (s3Url: string, key: string) => `${s3Url}/${key}`;
export const getImageKeyFromS3Url = (url: string, s3Url: string) =>
  url.replace(`${s3Url}/`, '');

@Injectable()
export class FarewellMediaEffects {
  #actions$ = inject(Actions);

  #farewellMediaService = inject(FarewellMediaService);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  uploadFarewellStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellMediaActions.uploadFarewellStorageMedia),
      switchMap(({ farewellId, profileId, items }) =>
        forkJoin(
          items.map(({ key, blob }) =>
            this.#farewellMediaService.uploadFarewellMedia(key, blob)
          )
        ).pipe(
          map((res) =>
            FeatFarewellMediaActions.uploadFarewellStorageMediaSuccess({
              farewellId,
              profileId,
              items: res,
            })
          ),
          // AWW S3 takes time to handle and make image available. It has eventual consistency so need a time for it to be available
          delay(2500),
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

  deleteFarewellStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellMediaActions.deleteFarewellStorageMedia),
      switchMap(({ url }) =>
        this.#farewellMediaService
          .deleteFarewellMedia(
            getImageKeyFromS3Url(url, this.#s3FarewellBaseUrl)
          )
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
}
