import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'join',
        loadComponent: () => import('@kitouch/ui/join').then(comp => comp.JoinComponent)
    },
    {
        path: '',
        loadComponent: () => import('@kitouch/ui/kit').then(m => m.KitComponent),
        loadChildren: () => import('@kitouch/ui/kit').then(m => m.kitRoutes)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
