import { MenuItem } from 'primeng/api';

export enum APP_PATH {
  Home = 'home',
  Profile = 'profile',
  Tweet = 'tweet',
  Messages = 'messages',
  Bookmarks = 'bookmarks',
  Settings = 'settings',
  AboutYourself = 'tell-us-about-yourself',
}

export const OUTLET_DIALOG = 'dialog';

export enum APP_PATH_DIALOG {
  Tweet = `tweet`,
}

export const NAV_ITEMS: Array<MenuItem> = [
  {
    label: 'Home',
    routerLink: APP_PATH.Home,
    icon: 'pi pi-home',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    label: 'Bookmarks',
    routerLink: APP_PATH.Bookmarks,
    icon: 'pi pi-bookmark',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]',
  },
  {
    separator: true
  },
  {
    label: 'Settings',
    routerLink: APP_PATH.Settings,
    icon: 'pi pi-cog',
    iconClass: 'text-lg font-semibold',
    styleClass: 'text-lg font-semibold ml-[-12px]'
  },
];
