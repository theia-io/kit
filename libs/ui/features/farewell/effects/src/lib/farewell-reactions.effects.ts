import { Injectable, inject } from '@angular/core';

import { FeatFarewellReactionActions } from '@kitouch/feat-farewell-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FarewellReactionsService } from './farewell-reactions.service';

export const getFullS3Url = (s3Url: string, key: string) => `${s3Url}/${key}`;
export const getImageKeyFromS3Url = (url: string, s3Url: string) =>
  url.replace(`${s3Url}/`, '');

@Injectable()
export class FarewellReactionsEffects {
  #actions$ = inject(Actions);
  #farewellMediaService = inject(FarewellReactionsService);

  getFarewellReactions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellReactionActions.getReactionsFarewell),
      switchMap(({ farewellId }) =>
        this.#farewellMediaService.getFarewellReactions(farewellId).pipe(
          map((reactions) =>
            FeatFarewellReactionActions.getReactionsFarewellSuccess({
              reactions,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellReactionActions.getReactionsFarewellFailure({
                message: `We were not able to get reactions to farewell: ${farewellId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  createReactionFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellReactionActions.postReactionFarewell),
      switchMap(({ reaction }) =>
        this.#farewellMediaService.postFarewellReaction(reaction).pipe(
          map((reactionResponse) =>
            FeatFarewellReactionActions.postReactionFarewellSuccess({
              reaction: reactionResponse,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellReactionActions.postReactionFarewellFailure({
                message: `We were not able to add reactions to farewell: ${reaction.farewellId}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  deleteFarewellReaction$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellReactionActions.deleteReactionFarewell),
      switchMap(({ id }) =>
        this.#farewellMediaService.deleteFarewellReaction(id).pipe(
          map(() =>
            FeatFarewellReactionActions.deleteReactionFarewellSuccess({
              id,
            })
          ),
          catchError((err) =>
            of(
              FeatFarewellReactionActions.deleteReactionFarewellFailure({
                message: `We were unable to remove farewell reaction, ${id}. Try contacting support: ${err.message}`,
              })
            )
          )
        )
      )
    )
  );
}
