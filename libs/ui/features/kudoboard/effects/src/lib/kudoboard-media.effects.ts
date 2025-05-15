import { Injectable, inject } from '@angular/core';

import { FeatKudoBoardMediaActions } from '@kitouch/data-kudoboard';
import { S3_KUDOBOARD_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { getFullS3Url, getImageKeyFromS3Url } from '@kitouch/shared-services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, forkJoin, map, of, switchMap } from 'rxjs';
import { KudoBoardMediaService } from './kudoboard-media.service';

@Injectable()
export class KudoBoardMediaEffects {
  #actions$ = inject(Actions);

  #kudoboardMediaService = inject(KudoBoardMediaService);
  #s3KudoBoardBaseUrl = inject(S3_KUDOBOARD_BUCKET_BASE_URL);

  uploadKudoBoardStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardMediaActions.uploadKudoBoardStorageMedia),
      switchMap(({ kudoboardId, profileId, items }) =>
        forkJoin(
          items.map(({ key, blob }) =>
            this.#kudoboardMediaService.uploadKudoBoardMedia(key, blob),
          ),
        ).pipe(
          map((items) =>
            items.map((item) => ({
              ...item,
              url: getFullS3Url(this.#s3KudoBoardBaseUrl, item.url),
              optimizedUrls: item.optimizedUrls.map((optimizedUrl) =>
                getFullS3Url(this.#s3KudoBoardBaseUrl, optimizedUrl),
              ),
            })),
          ),
          map((items) =>
            FeatKudoBoardMediaActions.uploadKudoBoardStorageMediaSuccess({
              kudoboardId,
              profileId,
              items,
            }),
          ),
          // AWS S3 bucket has eventual consistency so need a time for it to be available
          delay(2500),
          catchError(() =>
            of(
              FeatKudoBoardMediaActions.uploadKudoBoardStorageMediaFailure({
                message:
                  'We were unable to upload kudoboard media. Try adding later.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteKudoBoardStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardMediaActions.deleteKudoBoardStorageMedia),
      switchMap(({ url }) =>
        this.#kudoboardMediaService
          .deleteKudoBoardMedia(
            getImageKeyFromS3Url(url, this.#s3KudoBoardBaseUrl),
          )
          .pipe(
            map(() =>
              FeatKudoBoardMediaActions.deleteKudoBoardStorageMediaSuccess({
                url,
              }),
            ),
            catchError(() =>
              of(
                FeatKudoBoardMediaActions.deleteKudoBoardStorageMediaFailure({
                  message:
                    'We were unable to remove kudoboard media from S3 bucket. Try again later.',
                }),
              ),
            ),
          ),
      ),
    ),
  );
}
