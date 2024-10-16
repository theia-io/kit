import { Route } from '@angular/router';
import {
  APP_PATH,
  APP_PATH_ALLOW_ANONYMOUS,
  APP_PATH_DIALOG,
  APP_PATH_STATIC_PAGES,
  LayoutService,
  onlyForLoggedInGuard,
  onlyForLoggedInOrAnonymouslyLoggedInGuard,
  onlyForNotLoggedInGuard,
  OUTLET_DIALOG,
  PanelState,
} from '@kitouch/ui-shared';
import { KitStaticComponent } from './kit-static.component';
import { KitComponent } from './kit.component';
import { inject } from '@angular/core';

const pages = import('@kitouch/pages');

export const appRoutes: Route[] = [
  /** @TODO @FIXME remove after on 1st September 2024 */
  {
    path: `${APP_PATH_ALLOW_ANONYMOUS.Farewell}/:id`,
    redirectTo: `/s/${APP_PATH_ALLOW_ANONYMOUS.Farewell}/:id`,
  },
  {
    path: 's',
    component: KitStaticComponent,
    children: [
      {
        path: APP_PATH_STATIC_PAGES.SignIn,
        loadComponent: () => pages.then((comp) => comp.PageSignInComponent),
        canActivate: [onlyForNotLoggedInGuard],
      },
      {
        path: APP_PATH_STATIC_PAGES.Redirect,
        loadComponent: () => pages.then((comp) => comp.PageRedirectComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.Join,
        loadComponent: () => pages.then((comp) => comp.PageJoinComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.TermsAndConditions,
        loadComponent: () =>
          pages.then((comp) => comp.PageTermsConditionsComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.PrivacyPolicy,
        loadComponent: () =>
          pages.then((comp) => comp.PagePrivacyPolicyComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.Cookie,
        loadComponent: () => pages.then((comp) => comp.PageCookiesComponent),
      },
      {
        path: `${APP_PATH_ALLOW_ANONYMOUS.Farewell}/:id`,
        loadComponent: () =>
          pages.then((comp) => comp.PageFarewellViewComponent),
        canActivate: [onlyForLoggedInOrAnonymouslyLoggedInGuard],
      },
      {
        path: APP_PATH_STATIC_PAGES.IntroduceKit,
        loadComponent: () =>
          pages.then((comp) => comp.KitPagesIntroduceKitComponent),
      },
    ],
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
            loadChildren: () => pages.then((pages) => pages.PROFILE_ROUTES),
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
        loadComponent: () => pages.then((comp) => comp.PageSettingsComponent),
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
        path: APP_PATH.Suggestion,
        loadComponent: () => pages.then((comp) => comp.PageSuggestionComponent),
      },
      {
        path: APP_PATH.Farewell,
        canActivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Closed),
        ],
        canDeactivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Opened),
        ],
        children: [
          {
            path: '',
            loadComponent: () =>
              pages.then((comp) => comp.PageFarewellAllComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              pages.then((comp) => comp.PageFarewellEditComponent),
            canActivate: [],
          },
          {
            path: 'generate',
            loadComponent: () =>
              pages.then((comp) => comp.PageFarewellGenerateComponent),
          },
        ],
      },

      // Outlet
      {
        path: APP_PATH_DIALOG.Tweet,
        outlet: OUTLET_DIALOG,
        loadComponent: () =>
          import('@kitouch/feat-tweet-ui').then(
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
