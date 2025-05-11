import { Injectable, inject } from '@angular/core';

import { FeatFarewellMediaActions } from '@kitouch/feat-farewell-data';
import { S3_FAREWELL_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { getFullS3Url, getImageKeyFromS3Url } from '@kitouch/shared-services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, forkJoin, map, of, switchMap } from 'rxjs';
import { FarewellMediaService } from './farewell-media.service';

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
          map((items) =>
            items.map((item) => ({
              ...item,
              url: getFullS3Url(this.#s3FarewellBaseUrl, item.url),
              optimizedUrls: item.optimizedUrls.map((optimizedUrl) =>
                getFullS3Url(this.#s3FarewellBaseUrl, optimizedUrl)
              ),
            }))
          ),
          map((items) =>
            FeatFarewellMediaActions.uploadFarewellStorageMediaSuccess({
              farewellId,
              profileId,
              items,
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
