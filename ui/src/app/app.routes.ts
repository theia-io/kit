import { Route } from '@angular/router';
import {
  APP_PATH,
  onlyForLoggedInGuard,
  onlyForNotLoggedInGuard,
} from '@kitouch/ui/shared';
import { KitComponent } from './kit.component';

const pages = import('@kitouch/ui/pages');

export const appRoutes: Route[] = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.PageSignInComponent),
    canActivate: [onlyForNotLoggedInGuard],
  },
  {
    path: 'redirect',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.PageRedirectComponent),
  },
  {
    path: 'join',
    loadComponent: () => pages.then((comp) => comp.PageJoinComponent),
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () =>
      import('@kitouch/ui/pages').then(
        (comp) => comp.PageTermsConditionsComponent
      ),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('@kitouch/ui/pages').then(
        (comp) => comp.PagePrivacyPolicyComponent
      ),
  },
  {
    path: 'cookie',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.PageCookiesComponent),
  },
  {
    path: APP_PATH.AboutYourself,
    canActivate: [onlyForLoggedInGuard],
    loadComponent: () =>
      pages.then((comp) => comp.PageAboutYourselfComponent),
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
        loadComponent: () => pages.then((comp) => comp.PageHomeComponent),
        providers: [
          // provideState({ name: 'pages.home', reducer: pageHomeReducer }),
          // provideEffects(HomeTweetsEffects),
        ],
      },
      {
        path: APP_PATH.Profile,
        children: [
          {
            path: `:profileId/${APP_PATH.Tweet}/:id`,
            loadComponent: () => pages.then((comp) => comp.PageTweetComponent),
          },
          {
            path: ':profileId',
            loadComponent: () => pages.then((comp) => comp.PageTweetsComponent),
          },
        ],
      },
      {
        path: APP_PATH.Messages,
        loadComponent: () => pages.then((comp) => comp.PageMessagesComponent),
      },
      {
        path: APP_PATH.Bookmarks,
        loadComponent: () => pages.then((comp) => comp.PageBookmarksComponent),
      },
      {
        path: APP_PATH.Settings,
        children: [
          {
            path: '',
            loadComponent: () =>
              pages.then((comp) => comp.PageSettingsComponent),
          },
        ],
      },
      // {
      //   path: '**',
      //   redirectTo: APP_PATH.Home,
      // },
    ],
  },
  {
    path: 'not-found-error',
    loadComponent: () => pages.then((comp) => comp.PageErrorComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found-error',
  },
];
