import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LayoutComponent,
  NavBarComponent,
  SharedStaticInfoComponent,
} from '@kitouch/containers';
import { FeatFollowActions } from '@kitouch/feat-follow-data';

import { FeatFollowSuggestionsComponent } from '@kitouch/follow-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { OUTLET_DIALOG } from '@kitouch/shared-constants';

import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    //
    SharedStaticInfoComponent,
    FeatFollowSuggestionsComponent,
    LayoutComponent,
    NavBarComponent,
  ],
  selector: 'app-kitouch',
  template: `
    <shared-layout>
      <shared-navbar navbar [profile]="profile()" class="block"></shared-navbar>

      <router-outlet></router-outlet>

      <router-outlet [name]="outletSecondary"></router-outlet>

      <div right>
        <feat-follow-suggestions
          [suggestionConfig]="{
            cards: false,
            showFollowed: true,
            showRandomOrder: false
          }"
        />

        <div class="m-6 inline">
          <shared-static-info />
        </div>
      </div>
    </shared-layout>
  `,
})
export class KitComponent implements OnInit {
  #store = inject(Store);

  profile = this.#store.selectSignal(selectCurrentProfile);

  readonly outletSecondary = OUTLET_DIALOG;

  ngOnInit(): void {
    /** Data that will be required across all app */
    // this.#store.dispatch(FeatTweetBookmarkActions.getAll());
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }
}
