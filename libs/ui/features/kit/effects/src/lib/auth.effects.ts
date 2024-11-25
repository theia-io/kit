import { Injectable, inject } from '@angular/core';
import { AuthService } from '@kitouch/shared-infra';
import { Actions } from '@ngrx/effects';

@Injectable()
export class AuthEffects {
  #actions$ = inject(Actions);
  #authService = inject(AuthService);
}
