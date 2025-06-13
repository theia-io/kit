import { Route } from '@angular/router';
import {
  APP_PATH_ALLOW_ANONYMOUS,
  APP_PATH_DIALOG,
  APP_PATH_STATIC_PAGES,
  OUTLET_DIALOG,
} from '@kitouch/shared-constants';
import {
  onlyForLoggedInGuard,
  onlyForNotLoggedInGuard,
} from '@kitouch/shared-infra';
import { KitComponent } from './kit.component';
import { kitAppRoutes } from './routes/app.routes';
import { LOGIN_ROUTES } from './routes/login.routes';
import { pages } from './routes/shared';
import { STATIC_FEATURES_ROUTE } from './routes/static-features.route';
import { STATIC_LEGAL_ROUTES } from './routes/static-legal.routes';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./kit-static.component').then((comp) => comp.KitStaticComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [onlyForNotLoggedInGuard],
        children: [
          {
            path: '',
            title: 'Introducing Kitouch',
            loadComponent: () =>
              pages.then((comp) => comp.KitPagesIntroduceKitComponent),
          },
        ],
      },
      STATIC_FEATURES_ROUTE,
      ...LOGIN_ROUTES,
      ...STATIC_LEGAL_ROUTES,
      {
        path: `${APP_PATH_ALLOW_ANONYMOUS.Offboarding}/:id`,
        title: 'Kitouch - Offboarding reimagined',
        loadComponent: () =>
          pages.then((comp) => comp.PageOffboardingViewComponent),
      },
      {
        path: `${APP_PATH_ALLOW_ANONYMOUS.Farewell}/:id`,
        title: 'Kitouch - Farewell',
        loadComponent: () =>
          pages.then((comp) => comp.PageFarewellViewComponent),
      },
      {
        path: `${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
        title: 'Kitouch - Kudo Board',
        children: [
          {
            path: 'generate',
            title: 'Kitouch - New Kudo Board',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardEditComponent),
          },
          {
            path: ':id/edit',
            title: 'Kitouch - Edit Kudo Board',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardEditComponent),
          },
          {
            path: ':id',
            title: 'Kitouch - Kudo Board',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardViewComponent),
          },
        ],
      },
      {
        path: APP_PATH_STATIC_PAGES.IntroduceKit,
        title: 'Introducing Kitouch',
        loadComponent: () =>
          pages.then((comp) => comp.KitPagesIntroduceKitComponent),
      },
    ],
  },
  {
    path: '',
    component: KitComponent,
    canActivate: [onlyForLoggedInGuard],
    canActivateChild: [onlyForLoggedInGuard],
    children: [
      // Outlet
      {
        path: APP_PATH_DIALOG.Tweet,
        outlet: OUTLET_DIALOG,
        loadComponent: () =>
          import('@kitouch/feat-tweet-ui').then(
            (feat) => feat.FeatTweetDialogComponent
          ),
      },
      {
        path: 'app',
        children: kitAppRoutes,
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
