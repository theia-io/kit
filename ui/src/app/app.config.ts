import {
  HTTP_INTERCEPTORS,
  provideHttpClient
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { featReducer as accountFeatureReducer } from '@kitouch/features/account/data';
import { featTweetReducer } from '@kitouch/feat-tweet-data';
import { TweetsEffects } from '@kitouch/feat-tweet-effects';
import { AuthInterceptor } from '@kitouch/ui/shared';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { ProfileEffects } from '@kitouch/features/account/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    //
    provideAnimationsAsync(),
    // provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(appRoutes),
    // provideRouter(appRoutes, withDebugTracing()),
    provideStore({
      account: accountFeatureReducer,
      tweet: featTweetReducer,
    }),
    provideEffects([
      ProfileEffects,
      TweetsEffects
    ]),
    provideStoreDevtools(),

    // auth
    provideHttpClient(),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: realAppFactory,
    //   multi: true,
    //   deps: [HttpClient, AuthService],
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
