import { Route } from '@angular/router';
import { APP_PATH } from '@kitouch/ui/shared';

export const kitRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_PATH.Home
    },
    {
        path: APP_PATH.Home,
        loadComponent: () => import('@kitouch/ui/home').then(comp => comp.HomeComponent)
    },
    {
        path: APP_PATH.Tweets,
        loadComponent: () => import('@kitouch/ui/tweet').then(comp => comp.TweetsPageComponent)
    },
    {
        path: APP_PATH.Messages,
        loadComponent: () => import('@kitouch/ui/messages').then(comp => comp.MessagesComponent)
    },
    {
        path: APP_PATH.Bookmarks,
        loadComponent: () => import('@kitouch/ui/bookmarks').then(comp => comp.BookmarksComponent)
    },
    {
        path: APP_PATH.Settings,
        loadComponent: () => import('@kitouch/ui/settings').then(comp => comp.SettingsComponent),
    },
    {
        path: '**',
        redirectTo: APP_PATH.Home
    }
];
