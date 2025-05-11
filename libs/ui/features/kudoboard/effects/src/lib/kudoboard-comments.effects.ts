import { Injectable, inject } from '@angular/core';

import {
  FeatKudoBoardCommentActions,
  selectKudoBoardCommentById,
} from '@kitouch/data-kudoboard';
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
} from 'rxjs';
import { KudoBoardCommentsService } from './kudoboard-comments.service';
import { getImageKeyFromS3Url } from './kudoboard-media.effects';
import { S3_KUDOBOARD_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { ContractUploadedMedia } from '@kitouch/shared-models';

@Injectable()
export class KudoBoardCommentsEffects {
  #store = inject(Store);
  #actions$ = inject(Actions);
  #kudoboardCommentService = inject(KudoBoardCommentsService);
  #s3KudoBoardBaseUrl = inject(S3_KUDOBOARD_BUCKET_BASE_URL);

  getKudoBoardComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.getCommentsKudoBoard),
      switchMap(({ kudoboardId }) =>
        this.#kudoboardCommentService.getKudoBoardComments(kudoboardId).pipe(
          map((comments) =>
            FeatKudoBoardCommentActions.getCommentsKudoBoardSuccess({
              comments,
            }),
          ),
          catchError((err) =>
            of(
              FeatKudoBoardCommentActions.getCommentsKudoBoardFailure({
                message: `We were not able to get comments to kudoboard: ${kudoboardId}. Try contacting support: ${err.message}`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createCommentKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.postCommentKudoBoard),
      switchMap(({ comment }) =>
        this.#kudoboardCommentService.createKudoBoardComment(comment).pipe(
          map((comment) =>
            FeatKudoBoardCommentActions.postCommentKudoBoardSuccess({
              comment,
            }),
          ),
          catchError((err) =>
            of(
              FeatKudoBoardCommentActions.postCommentKudoBoardFailure({
                message: `We were not able to add comment to kudoboard: ${comment.kudoBoardId}. Try contacting support: ${err.message}`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteKudoBoardComment$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.deleteCommentKudoBoard),
      switchMap(({ id }) =>
        this.#kudoboardCommentService.deleteKudoBoardComment(id).pipe(
          map(() =>
            FeatKudoBoardCommentActions.deleteCommentKudoBoardSuccess({
              id,
            }),
          ),
          catchError((err) =>
            of(
              FeatKudoBoardCommentActions.deleteCommentKudoBoardFailure({
                message: `We were unable to remove kudoboard Comment, ${id}. Try contacting support: ${err.message}`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  uploadKudoBoardCommentStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.uploadKudoBoardCommentStorageMedia),
      switchMap(({ kudoBoardId, profileId, items }) =>
        forkJoin(
          items.map(({ key, blob }) =>
            this.#kudoboardCommentService.uploadKudoBoardCommentMedia(
              key,
              blob,
            ),
          ),
        ).pipe(
          map((res) =>
            FeatKudoBoardCommentActions.uploadKudoBoardCommentStorageMediaSuccess(
              {
                kudoBoardId,
                profileId,
                items: res,
              },
            ),
          ),
          catchError(() =>
            of(
              FeatKudoBoardCommentActions.uploadKudoBoardCommentStorageMediaFailure(
                {
                  message:
                    'We were unable to upload comment media. Try adding later.',
                },
              ),
            ),
          ),
        ),
      ),
    ),
  );

  deleteKudoBoardCommentStorageMedia$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.deleteKudoBoardCommentStorageMedia),
      mergeMap(({ url }) =>
        this.#kudoboardCommentService
          .deleteKudoBoardCommentMedia(
            getImageKeyFromS3Url(url, this.#s3KudoBoardBaseUrl),
          )
          .pipe(
            map(() =>
              FeatKudoBoardCommentActions.deleteKudoBoardCommentStorageMediaSuccess(
                {
                  url,
                },
              ),
            ),
            catchError(() =>
              of(
                FeatKudoBoardCommentActions.deleteKudoBoardCommentStorageMediaFailure(
                  {
                    message:
                      'We were unable to remove comment media from S3 bucket. Try again later.',
                  },
                ),
              ),
            ),
          ),
      ),
    ),
  );

  constructor() {
    this.#actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(FeatKudoBoardCommentActions.deleteCommentKudoBoard),
        switchMap(({ id }) =>
          this.#store.pipe(
            select(selectKudoBoardCommentById(id)),
            take(1),
            filter(Boolean),
          ),
        ),
        switchMap((comment) =>
          this.#actions$.pipe(
            ofType(FeatKudoBoardCommentActions.deleteCommentKudoBoardSuccess),
            filter(({ id }) => id === comment.id),
            take(1),
            map(() => comment.medias),
            filter(
              (medias): medias is Array<ContractUploadedMedia> =>
                !!medias && medias.length > 0,
            ),
          ),
        ),
      )
      .subscribe((medias) => {
        medias.forEach((media) => {
          [media.url].concat(media.optimizedUrls).forEach((url) =>
            this.#store.dispatch(
              FeatKudoBoardCommentActions.deleteKudoBoardCommentStorageMedia({
                url,
              }),
            ),
          );
        });
      });
  }
}
