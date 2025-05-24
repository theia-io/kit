import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent, merge, of, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { Auth0Service } from './auth0.service';

@Injectable({
  providedIn: 'root',
})
export class ActivitySessionCheckService {
  readonly #INACTIVITY_TIMEOUT_30_MINs = 30 * 60 * 1000; // 30 minutes
  #lastActivity = Date.now();

  #router = inject(Router);
  #authService = inject(Auth0Service); // Using inject()

  keepSessionAlive(): void {
    this.#setupActivityListeners();
    this.#setupInactivityTimer();
  }

  #setupActivityListeners(): void {
    merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'click'),
      fromEvent(window, 'scroll'),
      fromEvent(document, 'visibilitychange') // Tab focus/blur
    )
      .pipe(
        debounceTime(1000), // Process only after 1s of no activity
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        console.log('SIMPLE USER ACTIVITY', event.type, this.#router.url);
        // console.log('User activity detected');
        this.#lastActivity = Date.now();
        // If tab becomes visible after being hidden, or first significant activity
        if (document.visibilityState === 'visible') {
          this.#checkSessionIfNeeded();
        }
      });

    // Explicit check on tab focus
    fromEvent(window, 'focus')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        console.log('Tab focused, checking session if needed.');
        this.#checkSessionIfNeeded();
      });
  }

  #setupInactivityTimer(): void {
    timer(this.#INACTIVITY_TIMEOUT_30_MINs, this.#INACTIVITY_TIMEOUT_30_MINs) // Check periodically
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (
          Date.now() - this.#lastActivity >
          this.#INACTIVITY_TIMEOUT_30_MINs
        ) {
          console.log('Long inactivity detected, checking session.');
          this.#checkSessionIfNeeded(true); // Force check due to long inactivity
        }
      });
  }

  #checkSessionIfNeeded(forceCheck = false): void {
    console.log(
      'Checking session status due to inactivity or forced check',
      this.#router.url,
      forceCheck
    );
    this.#authService.loggedIn$
      .pipe(
        take(1),
        filter((isAuthenticated) => !isAuthenticated || forceCheck),
        switchMap(() => {
          // Always check if forced, or if currently marked as not authenticated
          console.log('Proactively checking session status...');
          return this.#authService
            .getCurrentSessionAccountUserProfiles() // true = attempt silent refresh
            .pipe(
              map(() => false),
              catchError(() => of(true)),
              filter((isAuthenticated) => isAuthenticated) // Only proceed if NOT authenticated / ERROR
            );
        })
      )
      .subscribe(() => {
        console.log(
          'SIGNING IN DUE TO INACTIVITY OR FORCE CHECK',
          this.#router.url
        );
        this.#authService.signIn(this.#router.url);
      });
  }
}
