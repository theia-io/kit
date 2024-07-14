import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FeatTweetBookmarkActions
} from '@kitouch/features/tweet/data';
import { FeatFollowActions } from '@kitouch/ui/features/follow/data';
import {
  APP_PATH,
  AuthService,
  LayoutComponent,
  NAV_ITEMS,
  NavBarComponent,
} from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';

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
export class KitComponent implements OnInit {
  title = 'Kitouch';

  #store = inject(Store);
  //
  #authService = inject(AuthService);

  profileUrl = APP_PATH.Profile;
  navBarItems = NAV_ITEMS;

  $profile = this.#authService.currentProfile$;

  ngOnInit(): void {
    /** Data that will be required across all app */
    this.#store.dispatch(FeatTweetBookmarkActions.getAll());
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  async logoutHandler() {
    await this.#authService.logout();
    window.location.reload();
  }

  helpHandler() {
    /** @TODO @FIXME Implement - read the comment below */
    console.log('Implement help support handler (with a little popup)');
  }
}
