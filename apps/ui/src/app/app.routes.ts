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

const pages = import('@kitouch/pages');

const pathWithAppPrefix = (path: string) =>
  path.split('app').slice(1).join('').slice(1);

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./kit-static.component').then((comp) => comp.KitStaticComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Introducing Kitouch',
        loadComponent: () =>
          pages.then((comp) => comp.KitPagesIntroduceKitComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.Features,
        title: 'Features',
        loadComponent: () => pages.then((comp) => comp.PagesFeatureComponent),
        children: [
          {
            path: APP_PATH_STATIC_PAGES.FeaturesConnected,
            title: 'Features - Connected',
            loadComponent: () =>
              pages.then((comp) => comp.PagesFeatureConnectedComponent),
          },
          {
            path: APP_PATH_STATIC_PAGES.FeaturesFarewell,
            title: 'Features - Farewell',
            loadComponent: () =>
              pages.then((comp) => comp.PagesFeatureFarewellComponent),
          },
          {
            path: APP_PATH_STATIC_PAGES.FeaturesKudoboard,
            title: 'Features - Kudo Board',
            loadComponent: () =>
              pages.then((comp) => comp.PagesFeatureKudoBoardComponent),
          },
        ],
      },
      {
        path: APP_PATH_STATIC_PAGES.SignIn,
        title: 'Kitouch - Sign In',
        loadComponent: () => pages.then((comp) => comp.PageSignInComponent),
        canActivate: [onlyForNotLoggedInGuard],
      },
      {
        path: APP_PATH_STATIC_PAGES.Redirect,
        title: 'Kitouch - Redirect',
        loadComponent: () =>
          pages.then((comp) => comp.PageRedirectAuth0Component),
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
        path: APP_PATH_STATIC_PAGES.TermsAndConditions,
        title: 'Kitouch - Terms and Conditions',
        loadComponent: () =>
          pages.then((comp) => comp.PageTermsConditionsComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.PrivacyPolicy,
        title: 'Kitouch - Privacy Policy',
        loadComponent: () =>
          pages.then((comp) => comp.PagePrivacyPolicyComponent),
      },
      {
        path: APP_PATH_STATIC_PAGES.Cookie,
        title: 'Kitouch - Cookie',
        loadComponent: () => pages.then((comp) => comp.PageCookiesComponent),
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
    path: APP_PATH.AboutYourself,
    title: 'Kitouch - About yourself',
    canActivate: [onlyForLoggedInGuard],
    loadComponent: () => pages.then((comp) => comp.PageAboutYourselfComponent),
  },
  {
    path: 'app',
    component: KitComponent,
    canActivate: [onlyForLoggedInGuard],
    canActivateChild: [onlyForLoggedInGuard],
    children: [
      // // Outlet
      // {
      //   outlet: OUTLET_DIALOG,
      //   path: APP_PATH_DIALOG.Tweet,
      //   loadComponent: () =>
      //     import('@kitouch/feat-tweet-ui').then(
      //       (feat) => feat.FeatTweetDialogComponent
      //     ),
      // },
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
            loadComponent: () => pages.then((comp) => comp.PageTweetComponent),
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
        loadComponent: () => pages.then((comp) => comp.PageBookmarksComponent),
      },
      {
        path: pathWithAppPrefix(APP_PATH.Settings),
        title: 'Kitouch - Settings',
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
        path: pathWithAppPrefix(APP_PATH.Suggestion),
        title: 'Kitouch - Follow Suggestions',
        loadComponent: () => pages.then((comp) => comp.PageSuggestionComponent),
      },
      {
        path: pathWithAppPrefix(APP_PATH.Farewell),
        title: 'Kitouch - Farewell',
        canActivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Closed),
        ],
        canDeactivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Opened),
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
          () => inject(LayoutService).rightPanelState.set(PanelState.Closed),
        ],
        canDeactivate: [
          () => inject(LayoutService).rightPanelState.set(PanelState.Opened),
        ],
        children: [
          {
            path: '',
            loadComponent: () =>
              pages.then((comp) => comp.PageKudoBoardsAllComponent),
          },
        ],
      },
      // Outlet
      {
        outlet: OUTLET_DIALOG,
        path: APP_PATH_DIALOG.Tweet,
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
