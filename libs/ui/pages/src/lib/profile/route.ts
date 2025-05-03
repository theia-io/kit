import { Routes } from '@angular/router';
import { PageProfileExperienceComponent } from './experience/experience.component';
import { PageProfileFollowingComponent } from './following/following.component';
import { PageProfileTweetsComponent } from './tweets/tweets.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile.component').then((comp) => comp.PageProfileComponent),
    children: [
      {
        path: 'activity',
        component: PageProfileTweetsComponent,
        title: 'Profile Activity',
      },
      {
        path: 'experience',
        component: PageProfileExperienceComponent,
        title: 'Profile Experience',
      },
      {
        path: 'following',
        component: PageProfileFollowingComponent,
        title: 'Profile Connections',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'activity',
      },
    ],
  },
];
