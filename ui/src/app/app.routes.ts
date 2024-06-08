import { Route } from '@angular/router';
import { pageHomeReducer } from '@kitouch/feat-tweet-data';
import { HomeTweetsEffects } from '@kitouch/feat-tweet-effects';
import {
  APP_PATH,
  onlyForLoggedInGuard,
  onlyForNotLoggedInGuard,
} from '@kitouch/ui/shared';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { KitComponent } from './kit.component';

const pages = import('@kitouch/ui/pages');

export const appRoutes: Route[] = [
  {
    path: 'join',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.JoinComponent),
    canActivate: [onlyForNotLoggedInGuard],
  },
  {
    path: 'redirect',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.RedirectComponent),
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.TermsConditionsComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.PrivacyPolicyComponent),
  },
  {
    path: 'cookie',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.CookiesComponent),
  },
  {
    path: '',
    component: KitComponent,
    canActivate: [onlyForLoggedInGuard],
    canActivateChild: [onlyForLoggedInGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_PATH.Home,
      },
      {
        path: APP_PATH.Home,
        loadComponent: () => pages.then((comp) => comp.HomeComponent),
        providers: [
          provideState({ name: 'home', reducer: pageHomeReducer }),
          provideEffects(HomeTweetsEffects),
        ],
      },
      {
        path: APP_PATH.Tweets,
        loadComponent: () => pages.then((comp) => comp.TweetsComponent),
      },
      {
        path: APP_PATH.Messages,
        loadComponent: () => pages.then((comp) => comp.MessagesComponent),
      },
      {
        path: APP_PATH.Bookmarks,
        loadComponent: () => pages.then((comp) => comp.BookmarksComponent),
      },
      {
        path: APP_PATH.Settings,
        loadComponent: () => pages.then((comp) => comp.SettingsComponent),
      },
      // {
      //   path: '**',
      //   redirectTo: APP_PATH.Home,
      // },
    ],
  },
  {
    path: 'not-found-error',
    loadComponent: () => pages.then((comp) => comp.ErrorPageComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found-error',
  },
];
