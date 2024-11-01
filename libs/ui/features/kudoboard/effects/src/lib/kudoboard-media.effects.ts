import { Injectable, inject } from '@angular/core';

import { FeatKudoBoardMediaActions } from '@kitouch/data-kudoboard';
import { S3_KUDOBOARD_BUCKET_BASE_URL } from '@kitouch/ui-shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { KudoBoardMediaService } from './kudoboard-media.service';

export const getFullS3Url = (s3Url: string, key: string) => `${s3Url}/${key}`;
export const getImageKeyFromS3Url = (url: string, s3Url: string) =>
  url.replace(`${s3Url}/`, '');

@Injectable()
export class KudoBoardMediaEffects {
  #actions$ = inject(Actions);

  #kudoboardMediaService = inject(KudoBoardMediaService);
  #s3KudoBoardBaseUrl = inject(S3_KUDOBOARD_BUCKET_BASE_URL);

  uploadKudoBoardStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardMediaActions.uploadKudoBoardStorageMedia),
      switchMap(({ kudoboardId, profileId, items }) =>
        forkJoin([
          items.map(({ key, blob }) =>
            this.#kudoboardMediaService.uploadKudoBoardMedia(key, blob)
          ),
        ]).pipe(
          map(() =>
            FeatKudoBoardMediaActions.uploadKudoBoardStorageMediaSuccess({
              kudoboardId,
              profileId,
              items: items.map((item) =>
                getFullS3Url(this.#s3KudoBoardBaseUrl, item.key)
              ),
            })
          ),
          catchError(() =>
            of(
              FeatKudoBoardMediaActions.uploadKudoBoardStorageMediaFailure({
                message:
                  'We were unable to upload kudoboard media. Try adding later.',
              })
            )
          )
        )
      )
    )
  );

  deleteKudoBoardStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardMediaActions.deleteKudoBoardStorageMedia),
      switchMap(({ url }) =>
        this.#kudoboardMediaService
          .deleteKudoBoardMedia(
            getImageKeyFromS3Url(url, this.#s3KudoBoardBaseUrl)
          )
          .pipe(
            map(() =>
              FeatKudoBoardMediaActions.deleteKudoBoardStorageMediaSuccess({
                url,
              })
            ),
            catchError(() =>
              of(
                FeatKudoBoardMediaActions.deleteKudoBoardStorageMediaFailure({
                  message:
                    'We were unable to remove kudoboard media from S3 bucket. Try again later.',
                })
              )
            )
          )
      )
    )
  );
}
