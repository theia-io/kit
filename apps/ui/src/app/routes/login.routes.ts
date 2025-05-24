import { Route } from '@angular/router';
import { APP_PATH, APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import {
  onlyForLoggedInGuard,
  onlyForNotLoggedInGuard,
} from '@kitouch/shared-infra';
import { pages } from './shared';

export const LOGIN_ROUTES: Array<Route> = [
  {
    path: APP_PATH_STATIC_PAGES.SignIn,
    title: 'Kitouch - Sign In',
    loadComponent: () => pages.then((comp) => comp.PageSignInComponent),
    canActivate: [onlyForNotLoggedInGuard],
  },
  {
    path: APP_PATH_STATIC_PAGES.Redirect,
    title: 'Kitouch - Redirect',
    loadComponent: () => pages.then((comp) => comp.PageRedirectAuth0Component),
  },
  {
    path: APP_PATH_STATIC_PAGES.SignInSemiSilent,
    title: 'Kitouch - Semi Silent Sign In',
    loadComponent: () =>
      pages.then((comp) => comp.PageSignInResolveSemiSilentComponent),
  },
  {
    path: APP_PATH_STATIC_PAGES.Join,
    title: 'Kitouch - Join',
    loadComponent: () => pages.then((comp) => comp.PageJoinComponent),
  },
  {
    path: APP_PATH.AboutYourself,
    title: 'Kitouch - About yourself',
    canActivate: [onlyForLoggedInGuard],
    loadComponent: () => pages.then((comp) => comp.PageAboutYourselfComponent),
  },
];
