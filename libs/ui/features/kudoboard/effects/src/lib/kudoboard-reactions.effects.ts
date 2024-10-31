import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { KudoBoardReactionsService } from './kudoboard-reactions.service';
import { FeatKudoBoardReactionActions } from '@kitouch/data-kudoboard';

@Injectable()
export class KudoBoardReactionsEffects {
  #actions$ = inject(Actions);
  #kudoboardMediaService = inject(KudoBoardReactionsService);

  getKudoBoardReactions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardReactionActions.getReactionsKudoBoard),
      switchMap(({ kudoBoardId }) =>
        this.#kudoboardMediaService.getKudoBoardReactions(kudoBoardId).pipe(
          map((reactions) =>
            FeatKudoBoardReactionActions.getReactionsKudoBoardSuccess({
              reactions,
            })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardReactionActions.getReactionsKudoBoardFailure({
                message: `We were not able to get reactions to kudoboard: ${kudoBoardId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  createReactionKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardReactionActions.postReactionKudoBoard),
      switchMap(({ reaction }) =>
        this.#kudoboardMediaService.postKudoBoardReaction(reaction).pipe(
          map((reactionResponse) =>
            FeatKudoBoardReactionActions.postReactionKudoBoardSuccess({
              reaction: reactionResponse,
            })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardReactionActions.postReactionKudoBoardFailure({
                message: `We were not able to add reactions to kudoboard: ${reaction.kudoBoardId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  deleteKudoBoardReaction$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardReactionActions.deleteReactionKudoBoard),
      switchMap(({ id }) =>
        this.#kudoboardMediaService.deleteKudoBoardReaction(id).pipe(
          map(() =>
            FeatKudoBoardReactionActions.deleteReactionKudoBoardSuccess({
              id,
            })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardReactionActions.deleteReactionKudoBoardFailure({
                message: `We were unable to remove kudoboard reaction, ${id}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );
}
