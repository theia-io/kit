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
  onlyForLoggedInOrAnonymouslyLoggedInGuard,
  onlyForNotLoggedInGuard,
} from '@kitouch/shared-infra';
import { KitComponent } from './kit.component';

const pages = import('@kitouch/pages');

export const appRoutes: Route[] = [
  /** @TODO @FIXME remove after on 1st September 2024 */
  {
    path: `${APP_PATH_ALLOW_ANONYMOUS.Farewell}/:id`,
    redirectTo: `/s/${APP_PATH_ALLOW_ANONYMOUS.Farewell}/:id`,
  },
  {
    path: 's',
    loadComponent: () =>
      import('./kit-static.component').then((comp) => comp.KitStaticComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_PATH_STATIC_PAGES.IntroduceKit,
      },
      {
        path: APP_PATH_STATIC_PAGES.Features,
        loadComponent: () => pages.then((comp) => comp.PagesFeatureComponent),
        children: [
          {
            path: APP_PATH_STATIC_PAGES.FeaturesConnected,
            loadComponent: () =>
              pages.then((comp) => comp.PagesFeatureConnectedComponent),
          },
          {
            path: APP_PATH_STATIC_PAGES.FeaturesFarewell,
            loadComponent: () =>
              pages.then((comp) => comp.PagesFeatureFarewellComponent),
          },
          {
            path: APP_PATH_STATIC_PAGES.FeaturesKudoboard,
            loadComponent: () =>
              pages.then((comp) => comp.PagesFeatureKudoBoardComponent),
          },
        ],
      },
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
        path: APP_PATH_STATIC_PAGES.RedirectAuth0,
        loadComponent: () =>
          pages.then((comp) => comp.PageRedirectAuth0Component),
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
        path: `${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
        canActivate: [onlyForLoggedInOrAnonymouslyLoggedInGuard],
        children: [
          {
            path: 'generate',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardEditComponent),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardEditComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardViewComponent),
          },
        ],
      },
      {
        path: APP_PATH_STATIC_PAGES.IntroduceKit,
        loadComponent: () =>
          pages.then((comp) => comp.KitPagesIntroduceKitComponent),
      },
    ],
  },
  {
    path: 'callback',
    loadComponent: () => pages.then((comp) => comp.PageRedirectAuth0Component),
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
            path: `:profileId/${APP_PATH.Tweet}/:id`,
            loadComponent: () => pages.then((comp) => comp.PageTweetComponent),
          },
          {
            path: ':profileId',
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
      {
        path: APP_PATH_ALLOW_ANONYMOUS.KudoBoard,
        canActivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Closed),
        ],
        canDeactivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Opened),
        ],
        loadComponent: () =>
          pages.then((comp) => comp.PageKudoBoardsAllComponent),
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
