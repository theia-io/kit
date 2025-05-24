import { Injectable, inject } from '@angular/core';

import { FeatOffboardingMediaActions } from '@kitouch/feat-offboarding-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, forkJoin, map, of, switchMap } from 'rxjs';
import { OffboardingMediaService } from './offboarding-media.service';

@Injectable()
export class OffboardingMediaEffects {
  #actions$ = inject(Actions);

  #offboardingMediaService = inject(OffboardingMediaService);

  uploadOffboardingStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatOffboardingMediaActions.uploadOffboardingStorageMedia),
      switchMap(({ offboardingId, profileId, items }) =>
        forkJoin(
          items.map(({ key, blob }) =>
            this.#offboardingMediaService.uploadOffboardingMedia(key, blob)
          )
        ).pipe(
          map((items) =>
            FeatOffboardingMediaActions.uploadOffboardingStorageMediaSuccess({
              offboardingId,
              profileId,
              items,
            })
          ),
          // AWS S3 bucket has eventual consistency so need a time for it to be available
          delay(2500),
          catchError(() =>
            of(
              FeatOffboardingMediaActions.uploadOffboardingStorageMediaFailure({
                message:
                  'We were unable to upload offboarding media. Try adding later.',
              })
            )
          )
        )
      )
    )
  );

  deleteOffboardingStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatOffboardingMediaActions.deleteOffboardingStorageMedia),
      switchMap(({ url }) =>
        this.#offboardingMediaService.deleteOffboardingMedia(url).pipe(
          map(() =>
            FeatOffboardingMediaActions.deleteOffboardingStorageMediaSuccess({
              url,
            })
          ),
          catchError(() =>
            of(
              FeatOffboardingMediaActions.deleteOffboardingStorageMediaFailure({
                message:
                  'We were unable to remove offboarding media from S3 bucket. Try again later.',
              })
            )
          )
        )
      )
    )
  );
}
