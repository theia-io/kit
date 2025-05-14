import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
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
import {
  featReducer as accountFeatureReducer,
  FeatAuth0Events,
} from '@kitouch/kit-data';
import {
  Auth0Service,
  authInterceptor,
  credentialsInterceptor,
  ENVIRONMENT,
  Environment,
  S3_FAREWELL_BUCKET_BASE_URL,
  S3_KUDOBOARD_BUCKET_BASE_URL,
  S3_PROFILE_BUCKET_BASE_URL,
} from '@kitouch/shared-infra';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNgcCookieConsent } from 'ngx-cookieconsent';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { filter, map, Observable, take } from 'rxjs';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { cookieConfig } from './cookie.config';

/**
 * Once app is initialized, we want to wait until the user was tried to
 * be resolved.
 *
 * This flow starts as `FeatAuth0Events.resolveUserForApp`.
 * - if it is successful, we dispatch
 * `FeatAuth0Events resolveUserForAppSuccess` which handled
 * inside `Auth0Effects.setAuthState$` and ultimately either sets user
 * and passed ultimately to `auth0Service.loggedInUser$`
 * - if it us unsuccessful, we dispatch
 * `FeatAuth0Events.resolveUserForAppFailure` and handled by
 * `Auth0Effects.resolveUserForAppFailure` which sets user to null and
 * also passes through to `auth0Service.loggedInUser$`
 *
 */
function initializeApp(store: Store, auth0Service: Auth0Service) {
  setTimeout(() => {
    store.dispatch(FeatAuth0Events.resolveUserForApp());
  });
  return (): Observable<boolean> =>
    auth0Service.loggedInUser$.pipe(
      filter((v) => v !== undefined),
      take(1),
      map(() => true)
    );
}

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
    // resolve user if it exists straight away
    // provideAppInitializer(() => {
    //   const store = inject(Store);
    //   store.dispatch(FeatAuth0Events.resolveUserForApp());
    //   return of(true);
    // }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Store, Auth0Service],
      multi: true,
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
