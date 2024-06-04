import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LayoutComponent,
  NAV_ITEMS,
  NavBarComponent,
} from '@kitouch/ui/shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    /** Features */
    LayoutComponent,
    NavBarComponent,
  ],
  selector: 'app-kitouch',
  template: `
    <layout>
      <navbar left [items]="navBarItems"></navbar>
      <router-outlet></router-outlet> </layout
    >,
  `,
})
export class KitComponent {
  title = 'Kitouch';

  navBarItems = NAV_ITEMS;
}
