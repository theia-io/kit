import { Injectable, inject } from '@angular/core';
import { FeatAccountApiActions } from '@kitouch/feat-kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AccountService } from './account.service';

@Injectable()
export class AccountsEffects {
  #actions$ = inject(Actions);
  #accountService = inject(AccountService);

  deleteAccount$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatAccountApiActions.delete),
      switchMap(({ account }) =>
        this.#accountService.deleteAccount$(account.id).pipe(
          map(() => FeatAccountApiActions.deleteSuccess({ account })),
          catchError((err) => {
            console.error('[[AccountsEffects] deleteAccount', err);
            return of(
              FeatAccountApiActions.deleteFailure({
                account,
                message: 'Cannot delete account now. Try later',
              })
            );
          })
        )
      )
    )
  );
}
