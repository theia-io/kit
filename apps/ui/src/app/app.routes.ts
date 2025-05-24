import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { LayoutService, PanelState } from '@kitouch/containers';
import {
  APP_PATH,
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
import { LOGIN_ROUTES } from './routes/login.routes';
import { pages, pathWithAppPrefix } from './routes/shared';
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
          pages.then((comp) => comp.PageFarewellViewComponent),
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
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: pathWithAppPrefix(APP_PATH.Feed),
          },
          {
            path: pathWithAppPrefix(APP_PATH.Feed),
            title: 'Kitouch - Feed',
            loadComponent: () => pages.then((comp) => comp.PageHomeComponent),
            providers: [
              // provideState({ name: 'pages.home', reducer: pageHomeReducer }),
              // provideEffects(HomeTweetsEffects),
            ],
          },
          {
            path: pathWithAppPrefix(APP_PATH.Profile),
            title: 'Kitouch - Profile',
            children: [
              {
                path: `:profileId/${APP_PATH.Tweet}/:id`,
                title: 'Kitouch - Tweet',
                loadComponent: () =>
                  pages.then((comp) => comp.PageTweetComponent),
              },
              {
                path: ':profileId',
                title: 'Kitouch - Profile',
                loadChildren: () => pages.then((pages) => pages.PROFILE_ROUTES),
              },
            ],
          },
          {
            path: pathWithAppPrefix(APP_PATH.Bookmarks),
            title: 'Kitouch - Bookmarks',
            loadComponent: () =>
              pages.then((comp) => comp.PageBookmarksComponent),
          },
          {
            path: pathWithAppPrefix(APP_PATH.Settings),
            title: 'Kitouch - Settings',
            loadComponent: () =>
              pages.then((comp) => comp.PageSettingsComponent),
            children: [
              {
                path: '',
                canActivate: [onlyForLoggedInGuard],
                loadComponent: () =>
                  pages.then((comp) => comp.PageAboutYourselfComponent),
              },
            ],
          },
          {
            path: pathWithAppPrefix(APP_PATH.Suggestion),
            title: 'Kitouch - Follow Suggestions',
            loadComponent: () =>
              pages.then((comp) => comp.PageSuggestionComponent),
          },
          {
            path: APP_PATH_ALLOW_ANONYMOUS.Offboarding,
            title: 'Kitouch - All Offboardings',
            canActivate: [
              () =>
                inject(LayoutService).rightPanelState.set(PanelState.Closed),
            ],
            canDeactivate: [
              () =>
                inject(LayoutService).rightPanelState.set(PanelState.Opened),
            ],
            children: [
              {
                path: '',
                loadComponent: () =>
                  pages.then((comp) => comp.PageOffboardingAllComponent),
              },
            ],
          },
          {
            path: pathWithAppPrefix(APP_PATH.Farewell),
            title: 'Kitouch - Farewell',
            canActivate: [
              () =>
                inject(LayoutService).rightPanelState.set(PanelState.Closed),
            ],
            canDeactivate: [
              () =>
                inject(LayoutService).rightPanelState.set(PanelState.Opened),
            ],
            children: [
              {
                path: '',
                title: 'Kitouch - All Farewells',
                loadComponent: () =>
                  pages.then((comp) => comp.PageFarewellAllComponent),
              },
              {
                path: 'edit/:id',
                title: 'Kitouch - Farewell Edit',
                loadComponent: () =>
                  pages.then((comp) => comp.PageFarewellEditComponent),
                canActivate: [],
              },
              {
                path: 'generate',
                title: 'Kitouch - New Farewell',
                loadComponent: () =>
                  pages.then((comp) => comp.PageFarewellGenerateComponent),
              },
            ],
          },
          {
            path: APP_PATH_ALLOW_ANONYMOUS.KudoBoard,
            title: 'Kitouch - All KudoBoards',
            canActivate: [
              () =>
                inject(LayoutService).rightPanelState.set(PanelState.Closed),
            ],
            canDeactivate: [
              () =>
                inject(LayoutService).rightPanelState.set(PanelState.Opened),
            ],
            children: [
              {
                path: '',
                loadComponent: () =>
                  pages.then((comp) => comp.PageKudoBoardsAllComponent),
              },
            ],
          },
        ],
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
