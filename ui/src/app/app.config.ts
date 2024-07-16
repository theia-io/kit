import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withDebugTracing } from '@angular/router';
import { featReducer as accountFeatureReducer } from '@kitouch/features/kit/data';
import {
  LegalEffects,
  ProfileEffects,
  UserEffects,
} from '@kitouch/features/kit/effects';
import { featTweetReducer } from '@kitouch/features/tweet/data';
import {
  BookmarkEffects,
  TweetsEffects,
} from '@kitouch/features/tweet/effects';
import { featFollowReducer } from '@kitouch/ui/features/follow/data';
import { FollowEffects } from '@kitouch/ui/features/follow/effects';
import { AuthInterceptor } from '@kitouch/ui/shared';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    //
    provideAnimationsAsync(),
    // provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // provideRouter(appRoutes),
    provideRouter(appRoutes, withDebugTracing()),
    provideStore({
      follow: featFollowReducer,
      kit: accountFeatureReducer,
      tweet: featTweetReducer,
    }),
    provideEffects([
      FollowEffects,
      ProfileEffects,
      UserEffects,
      LegalEffects,
      TweetsEffects,
      BookmarkEffects,
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
