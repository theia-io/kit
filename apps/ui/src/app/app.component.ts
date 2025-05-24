import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { ActivitySessionCheckService, KIT_ENVS } from '@kitouch/shared-infra';
import {
  NgcCookieConsentService,
  NgcInitializationErrorEvent,
  NgcInitializingEvent,
  NgcNoCookieLawEvent,
  NgcStatusChangeEvent,
} from 'ngx-cookieconsent';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #ccService = inject(NgcCookieConsentService);
  #activitySessionCheckService = inject(ActivitySessionCheckService);

  constructor() {
    /** @fixme @todo broken, keeps infinite redirects and kills tab */
    // this.#activitySessionCheckService.keepSessionAlive();
  }

  ngOnInit() {
    if (environment.environment !== KIT_ENVS.production) {
      console.info('ENVs:', environment);
    }

    // subscribe to cookieconsent observables to react to main events
    this.#ccService.popupOpen$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        // you can use this.#ccService.getConfig() to do stuff...
      });

    this.#ccService.popupClose$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        // you can use this.#ccService.getConfig() to do stuff...
      });

    this.#ccService.initializing$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event: NgcInitializingEvent) => {
        // the cookieconsent is initilializing... Not yet safe to call methods like `NgcCookieConsentService.hasAnswered()`
        console.info(`initializing: ${JSON.stringify(event)}`);
      });

    this.#ccService.initialized$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        // the cookieconsent has been successfully initialized.
        // It's now safe to use methods on NgcCookieConsentService that require it, like `hasAnswered()` for eg...
        console.info(`initialized: ${JSON.stringify(event)}`);
      });

    this.#ccService.initializationError$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event: NgcInitializationErrorEvent) => {
        // the cookieconsent has failed to initialize...
        console.info(
          `initializationError: ${JSON.stringify(event.error?.message)}`
        );
      });

    this.#ccService.statusChange$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event: NgcStatusChangeEvent) => {
        // you can use this.#ccService.getConfig() to do stuff...
      });

    this.#ccService.revokeChoice$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        // you can use this.#ccService.getConfig() to do stuff...
      });

    this.#ccService.noCookieLaw$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event: NgcNoCookieLawEvent) => {
        // you can use this.#ccService.getConfig() to do stuff...
      });
  }
}
