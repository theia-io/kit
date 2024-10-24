import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { featFarewellReducer } from '@kitouch/feat-farewell-data';
import {
  FarewellCommentsEffects,
  FarewellEffects,
  FarewellMediaEffects,
  FarewellReactionsEffects,
} from '@kitouch/feat-farewell-effects';
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
  RetweetEffects,
  TweetsEffects,
} from '@kitouch/feat-tweet-effects';
import { featReducer as accountFeatureReducer } from '@kitouch/kit-data';
import {
  AuthInterceptor,
  Environment,
  ENVIRONMENT,
  S3_FAREWELL_BUCKET_BASE_URL,
  S3_PROFILE_BUCKET_BASE_URL,
} from '@kitouch/ui-shared';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNgcCookieConsent } from 'ngx-cookieconsent';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
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

    // for dynamic dialog service
    importProvidersFrom(DynamicDialogModule),

    //
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    {
      provide: S3_PROFILE_BUCKET_BASE_URL,
      useFactory: ({ s3Config: { region, profileBucket } }: Environment) => {
        return `https://${profileBucket}.s3.${region}.amazonaws.com`;
      },
      deps: [ENVIRONMENT],
    },
    {
      provide: S3_FAREWELL_BUCKET_BASE_URL,
      useFactory: ({ s3Config: { region, farewellBucket } }: Environment) => {
        return `https://${farewellBucket}.s3.${region}.amazonaws.com`;
      },
      deps: [ENVIRONMENT],
    },

    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      })
    ),
    // provideRouter(appRoutes, withDebugTracing(), withComponentInputBinding()),
    provideStore({
      farewell: featFarewellReducer,
      follow: featFollowReducer,
      kit: accountFeatureReducer,
      tweet: featTweetReducer,
    }),
    provideEffects([
      // farewell
      FarewellCommentsEffects,
      FarewellMediaEffects,
      FarewellReactionsEffects,
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
      RetweetEffects,
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
