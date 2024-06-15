import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  APP_PATH,
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
        [items]="navBarItems"
        [profileBaseUrl]="profileUrl"
        [profile]="$profile | async"
        (help)="helpHandler()"
        (logout)="logoutHandler()"
        class="block"
        left
      ></navbar>
      <router-outlet></router-outlet> </layout
    >,
  `,
})
export class KitComponent {
  title = 'Kitouch';

  #authService = inject(AuthService);

  profileUrl = APP_PATH.Profile;
  navBarItems = NAV_ITEMS;

  $profile = this.#authService.currentProfile$;

  async logoutHandler() {
    await this.#authService.logout();
    window.location.reload();
  }

  helpHandler() {
    /** @TODO @FIXME Implement - read the comment below */
    console.log('Implement help support handler (with a little popup)');
  }
}
