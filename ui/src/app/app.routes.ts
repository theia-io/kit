import { Route } from '@angular/router';
import { APP_PATH } from '@kitouch/ui/shared';
import { KitComponent } from './kit.component';

const pages = import('@kitouch/ui/pages');

export const appRoutes: Route[] = [
  {
    path: 'join',
    loadComponent: () =>
      import('@kitouch/ui/pages').then((comp) => comp.JoinComponent),
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
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_PATH.Home,
      },
      {
        path: APP_PATH.Home,
        loadComponent: () => pages.then((comp) => comp.HomeComponent),
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
        loadComponent: () =>
          import('@kitouch/ui/pages').then((comp) => comp.SettingsComponent),
      },
      {
        path: '**',
        redirectTo: APP_PATH.Home,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
