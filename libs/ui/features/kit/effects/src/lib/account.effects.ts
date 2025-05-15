import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeatAccountApiActions } from '@kitouch/kit-data';
import { Auth0Service } from '@kitouch/shared-infra';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AccountService } from './account.service';

@Injectable()
export class AccountsEffects {
  #router = inject(Router);
  #actions$ = inject(Actions);
  #auth0Service = inject(Auth0Service);
  #accountService = inject(AccountService);

  deleteAccount$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatAccountApiActions.delete),
      switchMap(({ account }) =>
        this.#accountService.deleteAccount$(account.id).pipe(
          map(() => FeatAccountApiActions.deleteSuccess({ account })),
          catchError((err) => {
            console.error('[AccountsEffects] deleteAccount', err);
            return of(
              FeatAccountApiActions.deleteFailure({
                account,
                message: 'Cannot delete account now. Try later',
              }),
            );
          }),
        ),
      ),
    ),
  );

  deleteAccountSuccess$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(FeatAccountApiActions.deleteSuccess),
        tap(() => {
          this.#auth0Service.logout();
          this.#router.navigateByUrl('/app');
        }),
      ),
    {
      dispatch: false,
    },
  );
}
