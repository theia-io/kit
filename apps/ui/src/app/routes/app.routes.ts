import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { LayoutService, PanelState } from '@kitouch/containers';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { onlyForLoggedInGuard } from '@kitouch/shared-infra';
import { pathWithAppPrefix, pages } from './shared';

export const kitAppRoutes: Route[] = [
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
    path: APP_PATH_ALLOW_ANONYMOUS.Offboarding,
    title: 'Kitouch - All Offboardings',
    canActivate: [
      () => inject(LayoutService).rightPanelState.set(PanelState.Closed),
    ],
    canDeactivate: [
      () => inject(LayoutService).rightPanelState.set(PanelState.Opened),
    ],
    children: [
      {
        path: '',
        title: 'Kitouch - All offboarding experiences',
        loadComponent: () =>
          pages.then((comp) => comp.PageOffboardingAllComponent),
      },
      {
        path: 'generate',
        title: 'Kitouch - New offboarding experience',
        loadComponent: () =>
          pages.then((comp) => comp.PageOffboardingEditComponent),
      },
      {
        path: 'edit/:id',
        title: 'Kitouch - Edit offboarding experience',
        loadComponent: () =>
          pages.then((comp) => comp.PageOffboardingEditComponent),
      },
    ],
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
];
