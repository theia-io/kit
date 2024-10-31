import { Injectable, inject } from '@angular/core';

import { FeatKudoBoardCommentActions } from '@kitouch/data-kudoboard';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { KudoBoardCommentsService } from './kudoboard-comments.service';

@Injectable()
export class KudoBoardCommentsEffects {
  #actions$ = inject(Actions);
  #kudoboardCommentService = inject(KudoBoardCommentsService);

  getKudoBoardComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.getCommentsKudoBoard),
      switchMap(({ kudoboardId }) =>
        this.#kudoboardCommentService.getKudoBoardComments(kudoboardId).pipe(
          map((comments) =>
            FeatKudoBoardCommentActions.getCommentsKudoBoardSuccess({
              comments,
            })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardCommentActions.getCommentsKudoBoardFailure({
                message: `We were not able to get comments to kudoboard: ${kudoboardId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  createCommentKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.postCommentKudoBoard),
      switchMap(({ comment }) =>
        this.#kudoboardCommentService.postKudoBoardComment(comment).pipe(
          map((comment) =>
            FeatKudoBoardCommentActions.postCommentKudoBoardSuccess({
              comment,
            })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardCommentActions.postCommentKudoBoardFailure({
                message: `We were not able to add comment to kudoboard: ${comment.kudoBoardId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  deleteKudoBoardComment$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.deleteCommentKudoBoard),
      switchMap(({ id }) =>
        this.#kudoboardCommentService.deleteKudoBoardComment(id).pipe(
          map(() =>
            FeatKudoBoardCommentActions.deleteCommentKudoBoardSuccess({
              id,
            })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardCommentActions.deleteCommentKudoBoardFailure({
                message: `We were unable to remove kudoboard Comment, ${id}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );
}
