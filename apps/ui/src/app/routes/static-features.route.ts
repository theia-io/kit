import { Route } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { pages } from './shared';

export const STATIC_FEATURES_ROUTE: Route = {
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
};
