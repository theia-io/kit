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
        <article
          class="flex justify-center align-center gap-1 p-0.5  rounded-xl shadow-xl transition hover:animate-background hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
        >
          <span class="text-xl font-bold mr-2">(ex-)</span>
          <i class="pi pi-user" style="font-size: 1.5rem"></i>
          <i class="pi pi-users" style="font-size: 1.5rem"></i>
          <i class="pi pi-building" style="font-size: 1.5rem"></i>
          <i class="pi pi-user" style="font-size: 1.5rem"></i>
          <i class="pi pi-briefcase" style="font-size: 1.5rem"></i>
        </article>
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
