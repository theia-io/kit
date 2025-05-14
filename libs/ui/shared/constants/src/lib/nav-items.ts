import { MenuItem } from 'primeng/api';

/** For logged in users only */
export enum APP_PATH {
  Feed = 'app/feed',
  Profile = 'app/profile',
  Tweet = 'app/tweet',
  Messages = 'app/messages',
  Bookmarks = 'app/bookmarks',
  Settings = 'app/settings',
  AboutYourself = 'app/tell-us-about-yourself',
  Farewell = 'app/farewell',
  Suggestion = 'app/suggestion',
}

/** For anonymous users also */
export enum APP_PATH_ALLOW_ANONYMOUS {
  Farewell = `keep-in-touch`,
  KudoBoard = `kudo-board`,
}

/** For everybody (not even required to be logged in *anonymous* user) */
export enum APP_PATH_STATIC_PAGES {
  SignIn = `login`,
  SignInSemiSilent = `refresh-login`,
  Features = `features`,
  FeaturesConnected = `connected`,
  FeaturesKudoboard = `kudo-board`,
  FeaturesFarewell = `farewell`,
  Redirect = `redirect`,
  Join = `join`,
  TermsAndConditions = `terms-and-conditions`,
  PrivacyPolicy = `privacy-policy`,
  Cookie = `cookie`,
  IntroduceKit = `introducing-kit`,
}

export const OUTLET_DIALOG = 'tweet-dialog';

export enum APP_PATH_DIALOG {
  Tweet = `tweet-thoughts`,
}

export const DESKTOP_NAV_ITEMS: Array<MenuItem> = [
  {
    label: 'Feed',
    routerLink: `/${APP_PATH.Feed}`,
    icon: 'pi pi-home',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    label: 'Farewells',
    routerLink: `/${APP_PATH.Farewell}`,
    icon: 'pi pi-send',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    label: 'Kudo boards',
    routerLink: `/app/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
    icon: 'pi pi-sparkles',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    label: 'Bookmarks',
    routerLink: `/${APP_PATH.Bookmarks}`,
    icon: 'pi pi-bookmark',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    separator: true,
  },
  {
    label: 'Settings',
    routerLink: `/${APP_PATH.Settings}`,
    icon: 'pi pi-cog',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
];

export const MOBILE_NAV_ITEMS: Array<MenuItem> = [
  {
    label: 'Feed',
    routerLink: `/${APP_PATH.Feed}`,
    icon: 'pi pi-home',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    label: 'Kudoboards',
    routerLink: `/app/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
    icon: 'pi pi-sparkles',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    label: 'Farewells',
    routerLink: `/${APP_PATH.Farewell}`,
    icon: 'pi pi-send',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
];
