import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { featKudoBoardReducer } from '@kitouch/data-kudoboard';
import {
  KudoBoardAnalyticsEffects,
  KudoBoardCommentsEffects,
  KudoBoardEffects,
  KudoBoardMediaEffects,
  KudoBoardReactionsEffects,
} from '@kitouch/effects-kudoboard';
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
  Auth0Effects,
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
  authInterceptor,
  credentialsInterceptor,
  ENVIRONMENT,
  Environment,
  S3_FAREWELL_BUCKET_BASE_URL,
  S3_KUDOBOARD_BUCKET_BASE_URL,
  S3_PROFILE_BUCKET_BASE_URL,
} from '@kitouch/shared-infra';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNgcCookieConsent } from 'ngx-cookieconsent';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { cookieConfig } from './cookie.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
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
    {
      provide: S3_KUDOBOARD_BUCKET_BASE_URL,
      useFactory: ({ s3Config: { region, kudoBoardBucket } }: Environment) => {
        return `https://${kudoBoardBucket}.s3.${region}.amazonaws.com`;
      },
      deps: [ENVIRONMENT],
    },

    provideRouter(
      appRoutes,
      withDebugTracing(),
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    // provideRouter(appRoutes, withDebugTracing(), withComponentInputBinding()),
    provideStore({
      farewell: featFarewellReducer,
      follow: featFollowReducer,
      kit: accountFeatureReducer,
      tweet: featTweetReducer,
      kudoboard: featKudoBoardReducer,
    }),
    provideEffects([
      // kudoboard
      KudoBoardAnalyticsEffects,
      KudoBoardCommentsEffects,
      KudoBoardMediaEffects,
      KudoBoardReactionsEffects,
      KudoBoardEffects,
      // farewell
      FarewellCommentsEffects,
      FarewellMediaEffects,
      FarewellReactionsEffects,
      FarewellEffects,
      // follow feat effects
      FollowEffects,
      // kit feat effects
      Auth0Effects,
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
    provideNgcCookieConsent(cookieConfig),
    provideHttpClient(
      withInterceptors([authInterceptor, credentialsInterceptor])
    ),
  ],
};
