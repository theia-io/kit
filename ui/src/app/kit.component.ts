import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthService,
  LayoutComponent,
  NAV_ITEMS,
  NavBarComponent,
} from '@kitouch/ui/shared';
import { map } from 'rxjs/operators';

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
      [items]="navBarItems"
      [profiles]="$profiles | async"
        (help)="helpHandler()"
        (logout)="logoutHandler()"
        class="block mr-4"
        left
      ></navbar>
      <router-outlet></router-outlet> </layout
    >,
  `,
})
export class KitComponent {
  title = 'Kitouch';

  #authService = inject(AuthService);

  navBarItems = NAV_ITEMS;

  $profiles = this.#authService.profiles$;

  async logoutHandler() {
    await this.#authService.logout();
    window.location.reload();
  }

  helpHandler() {
    /** @TODO @FIXME Implement - read the comment below */
    console.log('Implement help support handler (with a little popup)');
  }
}
