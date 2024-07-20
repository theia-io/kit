import { Route } from '@angular/router';
import {
  APP_PATH,
  APP_PATH_DIALOG,
  onlyForLoggedInGuard,
  onlyForNotLoggedInGuard,
  OUTLET_DIALOG,
} from '@kitouch/ui/shared';
import { KitComponent } from './kit.component';

const pages = import('@kitouch/ui/pages');

export const appRoutes: Route[] = [
  {
    path: 'sign-in',
    loadComponent: () => pages.then((comp) => comp.PageSignInComponent),
    canActivate: [onlyForNotLoggedInGuard],
  },
  {
    path: 'redirect',
    loadComponent: () => pages.then((comp) => comp.PageRedirectComponent),
  },
  {
    path: 'join',
    loadComponent: () => pages.then((comp) => comp.PageJoinComponent),
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () =>
      pages.then((comp) => comp.PageTermsConditionsComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => pages.then((comp) => comp.PagePrivacyPolicyComponent),
  },
  {
    path: 'cookie',
    loadComponent: () => pages.then((comp) => comp.PageCookiesComponent),
  },
  {
    path: APP_PATH.AboutYourself,
    canActivate: [onlyForLoggedInGuard],
    loadComponent: () => pages.then((comp) => comp.PageAboutYourselfComponent),
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
            path: `:profileIdOrAlias/${APP_PATH.Tweet}/:id`,
            loadComponent: () => pages.then((comp) => comp.PageTweetComponent),
          },
          {
            path: ':profileIdOrAlias',
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
      {
        path: APP_PATH_DIALOG.Tweet,
        outlet: OUTLET_DIALOG,
        loadComponent: () =>
          import('@kitouch/features/tweet/ui').then(
            (feat) => feat.FeatTweetDialogComponent
          ),
      },
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
