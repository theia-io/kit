import { Routes } from '@angular/router';
import { PageProfileExperienceComponent } from './experience/experience.component';
import { PageProfileTweetsComponent } from './tweets/tweets.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile.component').then((comp) => comp.PageProfileComponent),
    children: [
      {
        path: 'tweets',
        component: PageProfileTweetsComponent,
      },
      {
        path: 'experience',
        component: PageProfileExperienceComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tweets',
      },
    ],
  },
];
