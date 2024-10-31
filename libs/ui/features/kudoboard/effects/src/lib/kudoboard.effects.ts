import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';

import { FeatKudoBoardActions } from '@kitouch/data-kudoboard';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { KudoBoardService } from './kudoboard.service';

@Injectable()
export class KudoBoardEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  #kudoboardService = inject(KudoBoardService);

  #currentProfile = this.#store.select(selectCurrentProfile);

  getKudoBoards$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.getProfileKudoBoards),
      switchMap(({ profileId }) =>
        this.#kudoboardService.getKudoBoards(profileId)
      ),
      map((kudoboards) =>
        FeatKudoBoardActions.getKudoBoardsSuccess({ kudoboards })
      )
    )
  );

  getKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.getKudoBoard),
      switchMap(({ id }) => this.#kudoboardService.getKudoBoard(id)),
      map((kudoboard) =>
        kudoboard
          ? FeatKudoBoardActions.getKudoBoardSuccess({ kudoboard })
          : FeatKudoBoardActions.getKudoBoardFailure({
              message: 'Did not find this kudoboard.',
            })
      )
    )
  );

  createKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.createKudoBoard),
      withLatestFrom(this.#currentProfile),
      switchMap(([{ kudoboard }, profile]) =>
        this.#kudoboardService.createKudoBoard({
          ...kudoboard,
          profileId: profile?.id,
          profile,
        })
      ),
      map((kudoboard) =>
        FeatKudoBoardActions.createKudoBoardSuccess({ kudoboard })
      )
    )
  );

  putKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.putKudoBoard),
      switchMap(({ kudoboard }) =>
        this.#kudoboardService.putKudoBoard(kudoboard).pipe(
          map((kudoboard) =>
            FeatKudoBoardActions.putKudoBoardSuccess({ kudoboard })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardActions.putKudoBoardFailure({
                message: `Failed to update kudoboard. Try again later or contact support. ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  deleteKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.deleteKudoBoard),
      switchMap(({ id }) =>
        this.#kudoboardService.deleteKudoBoard(id).pipe(
          map((deleted) =>
            deleted
              ? FeatKudoBoardActions.deleteKudoBoardSuccess({ id })
              : FeatKudoBoardActions.deleteKudoBoardFailure({
                  message:
                    'It seems this kudoboard cannot be deleted. Please, get in touch with us.',
                })
          ),
          catchError(() =>
            of(
              FeatKudoBoardActions.deleteKudoBoardFailure({
                message:
                  'We were unable to delete kudoboard. It is not you, its us. Try again later or contact us directly',
              })
            )
          )
        )
      )
    )
  );
}
