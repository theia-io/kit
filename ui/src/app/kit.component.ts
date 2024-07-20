import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeatTweetBookmarkActions } from '@kitouch/features/tweet/data';
import { FeatFollowActions } from '@kitouch/ui/features/follow/data';

import { FeatFollowSuggestionsComponent } from '@kitouch/ui/features/follow/ui';
import {
  APP_PATH,
  APP_PATH_DIALOG,
  AuthService,
  LayoutComponent,
  NAV_ITEMS,
  NavBarComponent,
  OUTLET_DIALOG,
} from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    //
    /** Features */
    FeatFollowSuggestionsComponent,
    LayoutComponent,
    NavBarComponent,
  ],
  selector: 'app-kitouch',
  template: `
    <layout>
      <navbar
        left
        [items]="navBarItems"
        [profileBaseUrl]="profileUrl"
        [profile]="$profile | async"
        (tweetButtonClick)="tweetButtonHandler()"
        (help)="helpHandler()"
        (logout)="logoutHandler()"
        class="block"
      ></navbar>

      <router-outlet></router-outlet>

      <router-outlet [name]="outletSecondary"></router-outlet>

      <div right>
        <div class="flex rounded-lg bg-neutral-200 mb-2">
          <h2 class="px-4 py-2 text-xl font-semibold ">My (ex-) colleagues</h2>
        </div>
        <feat-follow-suggestions
          [suggestionConfig]="{
            cards: false,
            showFollowed: true,
            showRandomOrder: false
          }"
        />
      </div> </layout
    >,
  `,
})
export class KitComponent implements OnInit {
  title = 'Kitouch';

  #router = inject(Router);
  #store = inject(Store);
  //
  #authService = inject(AuthService);

  readonly outletSecondary = OUTLET_DIALOG;
  profileUrl = APP_PATH.Profile;
  navBarItems = NAV_ITEMS;

  $profile = this.#authService.currentProfile$;

  ngOnInit(): void {
    /** Data that will be required across all app */
    this.#store.dispatch(FeatTweetBookmarkActions.getAll());
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  tweetButtonHandler() {
    this.#router.navigate([
      { outlets: { [this.outletSecondary]: APP_PATH_DIALOG.Tweet } },
    ]);
  }

  helpHandler() {
    /** @TODO @FIXME Implement - read the comment below */
    console.log('Implement help support handler (with a little popup)');
  }

  async logoutHandler() {
    await this.#authService.logout();
    window.location.reload();
  }
}
