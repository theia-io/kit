import { Injectable, inject } from '@angular/core';

import {
  FeatFarewellCommentActions,
  selectFarewellById,
  selectFarewellCommentById,
  selectFarewellCommentsById,
} from '@kitouch/feat-farewell-data';
import { S3_FAREWELL_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { FarewellCommentsService } from './farewell-comments.service';
import { getImageKeyFromS3Url } from './farewell-media.effects';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContractUploadedMedia } from '@kitouch/shared-models';

@Injectable()
export class FarewellCommentsEffects {
  #store$ = inject(Store);
  #actions$ = inject(Actions);
  #farewellCommentService = inject(FarewellCommentsService);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  getFarewellComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.getCommentsFarewell),
      switchMap(({ farewellId }) =>
        this.#farewellCommentService.getFarewellComments(farewellId).pipe(
          map((comments) =>
            FeatFarewellCommentActions.getCommentsFarewellSuccess({
              comments,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellCommentActions.getCommentsFarewellFailure({
                message: `We were not able to get comments to farewell: ${farewellId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  createCommentFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.postCommentFarewell),
      switchMap(({ comment }) =>
        this.#farewellCommentService.postFarewellComment(comment).pipe(
          map((comment) =>
            FeatFarewellCommentActions.postCommentFarewellSuccess({
              comment,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellCommentActions.postCommentFarewellFailure({
                message: `We were not able to add comment to farewell: ${comment.farewellId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  createBatchCommentsFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.batchCommentsFarewell),
      switchMap(({ comments }) =>
        this.#farewellCommentService.batchFarewellComments(comments).pipe(
          map((comments) =>
            FeatFarewellCommentActions.batchCommentsFarewellSuccess({
              comments,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellCommentActions.batchCommentsFarewellFailure({
                message: `We were not able to add comments to farewell. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  deleteFarewellComment$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.deleteCommentFarewell),
      switchMap(({ id }) =>
        this.#farewellCommentService.deleteFarewellComment(id).pipe(
          map(() =>
            FeatFarewellCommentActions.deleteCommentFarewellSuccess({
              id,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellCommentActions.deleteCommentFarewellFailure({
                message: `We were unable to remove farewell Comment, ${id}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  uploadFarewellStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.uploadFarewellCommentStorageMedia),
      switchMap(({ farewellId, profileId, items }) =>
        forkJoin(
          items.map(({ key, blob }) =>
            this.#farewellCommentService.uploadFarewellCommentMedia(key, blob)
          )
        ).pipe(
          map((res) =>
            FeatFarewellCommentActions.uploadFarewellCommentStorageMediaSuccess(
              {
                farewellId,
                profileId,
                items: res,
              }
            )
          ),
          catchError(() =>
            of(
              FeatFarewellCommentActions.uploadFarewellCommentStorageMediaFailure(
                {
                  message:
                    'We were unable to upload comment media. Try adding later.',
                }
              )
            )
          )
        )
      )
    )
  );

  deleteFarewellCommentStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.deleteFarewellCommentStorageMedia),
      mergeMap(({ url }) =>
        this.#farewellCommentService
          .deleteFarewellCommentMedia(
            getImageKeyFromS3Url(url, this.#s3FarewellBaseUrl)
          )
          .pipe(
            map(() =>
              FeatFarewellCommentActions.deleteFarewellCommentStorageMediaSuccess(
                {
                  url,
                }
              )
            ),
            catchError(() =>
              of(
                FeatFarewellCommentActions.deleteFarewellCommentStorageMediaFailure(
                  {
                    message:
                      'We were unable to remove comment media from S3 bucket. Try again later.',
                  }
                )
              )
            )
          )
      )
    )
  );

  constructor() {
    this.#actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(FeatFarewellCommentActions.deleteCommentFarewell),
        switchMap(({ id }) =>
          this.#store$.pipe(
            select(selectFarewellCommentById(id)),
            take(1),
            filter(Boolean)
          )
        ),
        switchMap((comment) =>
          this.#actions$.pipe(
            ofType(FeatFarewellCommentActions.deleteCommentFarewellSuccess),
            filter(({ id }) => id === comment.id),
            take(1),
            map(() => comment.medias),
            filter(
              (medias): medias is Array<ContractUploadedMedia> =>
                !!medias && medias.length > 0
            )
          )
        )
      )
      .subscribe((medias) => {
        medias.forEach((media) => {
          [media.url].concat(media.optimizedUrls).forEach((url) =>
            this.#store$.dispatch(
              FeatFarewellCommentActions.deleteFarewellCommentStorageMedia({
                url,
              })
            )
          );
        });
      });
  }
}
