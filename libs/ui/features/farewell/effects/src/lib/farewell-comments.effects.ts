import { Injectable, inject } from '@angular/core';

import { FeatFarewellCommentActions } from '@kitouch/feat-farewell-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FarewellCommentsService } from './farewell-comments.service';

@Injectable()
export class FarewellCommentsEffects {
  #actions$ = inject(Actions);
  #farewellCommentService = inject(FarewellCommentsService);

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
}
