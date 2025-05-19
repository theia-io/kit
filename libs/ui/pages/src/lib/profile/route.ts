import { Routes } from '@angular/router';
import { PageProfileConnectionsComponent } from './connections/connections.component';
import { PageProfileFollowersComponent } from './connections/followers/followers.component';
import { PageProfileFollowingComponent } from './connections/following/following.component';
import { PageProfileExperienceComponent } from './experience/experience.component';
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
        path: 'connections',
        component: PageProfileConnectionsComponent,
        title: 'Profile connections',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'following',
          },
          {
            path: 'following',
            component: PageProfileFollowingComponent,
            title: 'Following profiles',
          },
          {
            path: 'followers',
            component: PageProfileFollowersComponent,
            title: 'Followers',
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'activity',
      },
    ],
  },
];
