import { Injectable, inject } from '@angular/core';
import { selectUser } from '@kitouch/feat-kit-data';

import { FeatFollowActions } from '@kitouch/feat-follow-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { FollowService } from './follow.service';

@Injectable()
export class FollowEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #followService = inject(FollowService);

  #currentUser = this.#store.select(selectUser).pipe(filter(Boolean));

  getSuggestionColleaguesToFollow$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFollowActions.getSuggestionColleaguesToFollow),
      withLatestFrom(this.#currentUser),
      switchMap(([_, user]) =>
        this.#followService.getColleaguesProfileSuggestions$(user).pipe(
          map((profiles) =>
            FeatFollowActions.getSuggestionColleaguesToFollowSuccess({
              profiles,
            })
          ),
          catchError((err) => {
            console.error(
              '[FollowEffects] getSuggestionColleaguesToFollow',
              err
            );
            return of(
              FeatFollowActions.getSuggestionColleaguesToFollowFailure({
                message: 'Cannot get any colleague profiles to follow',
              })
            );
          })
        )
      )
    )
  );
}
