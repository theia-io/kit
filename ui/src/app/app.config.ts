import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { featFarewellReducer } from '@kitouch/feat-farewell-data';
import { FarewellEffects } from '@kitouch/feat-farewell-effects';
import { featFollowReducer } from '@kitouch/feat-follow-data';
import { FollowEffects } from '@kitouch/feat-follow-effects';
import {
  AccountsEffects,
  LegalEffects,
  ProfileEffects,
  UserEffects,
} from '@kitouch/feat-kit-effects';
import { featTweetReducer } from '@kitouch/feat-tweet-data';
import {
  BookmarkEffects,
  CommentsEffects,
  TweetsEffects,
} from '@kitouch/feat-tweet-effects';
import { featReducer as accountFeatureReducer } from '@kitouch/kit-data';
import { AuthInterceptor, ENVIRONMENT } from '@kitouch/ui-shared';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNgcCookieConsent } from 'ngx-cookieconsent';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { cookieConfig } from './cookie.config';

// const kitProviders: Provider[] = [];
// if (environment.environment !== KIT_ENVS.localhost) {
//   kitProviders.push(provideNgcCookieConsent(cookieConfig));
// }

export const appConfig: ApplicationConfig = {
  providers: [
    //
    provideAnimationsAsync(),
    // provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    //
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },

    provideRouter(appRoutes),
    // provideRouter(appRoutes, withDebugTracing()),
    provideStore({
      farewell: featFarewellReducer,
      follow: featFollowReducer,
      kit: accountFeatureReducer,
      tweet: featTweetReducer,
    }),
    provideEffects([
      FarewellEffects,
      // follow feat effects
      FollowEffects,
      // kit feat effects
      AccountsEffects,
      LegalEffects,
      ProfileEffects,
      UserEffects,
      // tweet feat effects
      BookmarkEffects,
      CommentsEffects,
      TweetsEffects,
    ]),
    provideStoreDevtools(),

    // auth
    // ...kitProviders,
    provideNgcCookieConsent(cookieConfig),
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
