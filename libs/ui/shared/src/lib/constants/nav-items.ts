import { NavBarItem } from '../components/navbar/navbar.component';

export enum APP_PATH {
  Home = 'home',
  Tweets = 'tweets',
  Messages = 'messages',
  Bookmarks = 'bookmarks',
  Settings = 'settings',
}

export const NAV_ITEMS: Array<NavBarItem> = [
  {
    name: 'Home',
    link: APP_PATH.Home,
    icon: `<svg class="mr-4 h-6 w-6 " stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6" />
</svg>`,
  },
  {
    name: 'Messages',
    link: APP_PATH.Messages,
    icon: `<svg class="mr-4 h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    stroke="currentColor" viewBox="0 0 24 24">
    <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
    </path>
</svg>`,
  },
  {
    name: 'Bookmarks',
    link: APP_PATH.Bookmarks,
    icon: `<svg class="mr-4 h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
</svg>`,
  },
  {
    name: 'Settings',
    link: APP_PATH.Settings,
    icon: `<svg class="mr-4 h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
</svg>`,
  },
];
