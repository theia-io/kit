import { Injectable, inject } from '@angular/core';

import { FeatFollowActions } from '@kitouch/feat-follow-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FollowService } from './follow.service';

@Injectable()
export class FollowEffects {
  #actions$ = inject(Actions);
  #followService = inject(FollowService);

  getSuggestionColleaguesToFollow$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFollowActions.getSuggestionColleaguesToFollow),
      switchMap(() =>
        this.#followService.getColleaguesProfileSuggestions$().pipe(
          map((profiles) =>
            FeatFollowActions.getSuggestionColleaguesToFollowSuccess({
              profiles,
            }),
          ),
          catchError((err) => {
            console.error(
              '[FollowEffects] getSuggestionColleaguesToFollow',
              err,
            );
            return of(
              FeatFollowActions.getSuggestionColleaguesToFollowFailure({
                message: 'Cannot get any colleague profiles to follow',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
