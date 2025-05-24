import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { pages } from './shared';

export const STATIC_LEGAL_ROUTES = [
  {
    path: APP_PATH_STATIC_PAGES.TermsAndConditions,
    title: 'Kitouch - Terms and Conditions',
    loadComponent: () =>
      pages.then((comp) => comp.PageTermsConditionsComponent),
  },
  {
    path: APP_PATH_STATIC_PAGES.PrivacyPolicy,
    title: 'Kitouch - Privacy Policy',
    loadComponent: () => pages.then((comp) => comp.PagePrivacyPolicyComponent),
  },
  {
    path: APP_PATH_STATIC_PAGES.Cookie,
    title: 'Kitouch - Cookie',
    loadComponent: () => pages.then((comp) => comp.PageCookiesComponent),
  },
];
