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
        pa
    }
    {
        path: '**',
        redirectTo: ''
    }
];
