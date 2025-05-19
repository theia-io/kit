import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'kit-page-profile-connections',
  template: `
    <p-tabMenu styleClass="my-4" [model]="connectionTabs" />
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, TabMenuModule],
})
export class PageProfileConnectionsComponent {
  connectionTabs: MenuItem[] = [
    {
      label: 'Following',
      icon: 'pi pi-fw pi-users',
      routerLink: 'following',
    },
    {
      label: 'Followers',
      icon: 'pi pi-fw pi-users',
      routerLink: 'followers',
    },
  ];
}
