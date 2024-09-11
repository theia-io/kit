import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatFollowActions } from '@kitouch/feat-follow-data';

import { FeatFollowSuggestionsComponent } from '@kitouch/follow-ui';
import {
  LayoutComponent,
  NavBarComponent,
  OUTLET_DIALOG,
} from '@kitouch/ui-shared';
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
    <shared-layout>
      <shared-navbar left class="block"></shared-navbar>

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
      </div>
    </shared-layout>
  `,
})
export class KitComponent implements OnInit {
  #store = inject(Store);

  readonly outletSecondary = OUTLET_DIALOG;

  ngOnInit(): void {
    /** Data that will be required across all app */
    // this.#store.dispatch(FeatTweetBookmarkActions.getAll());
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }
}
