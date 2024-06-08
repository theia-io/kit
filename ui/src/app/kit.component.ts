import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthService,
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
      <navbar
        (help)="helpHandler()"
        (logout)="logoutHandler()"
        class="block mr-4"
        left
        [items]="navBarItems"
      ></navbar>
      <router-outlet></router-outlet> </layout
    >,
  `,
})
export class KitComponent {
  title = 'Kitouch';

  #authService = inject(AuthService);

  navBarItems = NAV_ITEMS;

  async logoutHandler() {
    await this.#authService.logout();
    window.location.reload();
  }

  helpHandler() {
    /** @TODO @FIXME Implement - read the comment below */
    console.log('Implement help support handler (with a little popup)');
  }
}
