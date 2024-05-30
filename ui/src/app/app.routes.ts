import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('@kitouch/ui/kit').then(m => m.KitComponent),
        loadChildren: () => import('@kitouch/ui/kit').then(m => m.kitRoutes)
    },
    {
        path: 'join',
        loadComponent: () => import('@kitouch/ui/join').then(comp => comp.JoinComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
