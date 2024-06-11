import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withDebugTracing } from '@angular/router';
import { featTweetReducer } from '@kitouch/feat-tweet-data';
import { TweetsEffects } from '@kitouch/feat-tweet-effects';
import { AuthInterceptor, AuthService } from '@kitouch/ui/shared';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';

const realAppFactory = (_: HttpClient, _1: AuthService) => {
  return () => Promise.resolve();
};

export const appConfig: ApplicationConfig = {
  providers: [
    //
    provideAnimationsAsync(),
    // provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(appRoutes),
    // provideRouter(appRoutes, withDebugTracing()),
    provideStore({
      tweet: featTweetReducer,
    }),
    provideEffects([TweetsEffects]),
    provideStoreDevtools(),

    // auth
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: realAppFactory,
      multi: true,
      deps: [HttpClient, AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
