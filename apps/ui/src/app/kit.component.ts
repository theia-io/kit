import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { LayoutComponent, NavBarComponent } from '@kitouch/containers';
import { FeatFollowActions } from '@kitouch/feat-follow-data';

import { FeatFollowSuggestionsComponent } from '@kitouch/follow-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { OUTLET_DIALOG } from '@kitouch/shared-constants';

import { select, Store } from '@ngrx/store';
import { distinctUntilKeyChanged, filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    //
    FeatFollowSuggestionsComponent,
    LayoutComponent,
    NavBarComponent,
  ],
  selector: 'app-kitouch',
  template: `
    <shared-layout>
      <shared-navbar navbar [profile]="profile()" class="block"></shared-navbar>

      <router-outlet name="tweet-dialog"></router-outlet>
      <router-outlet></router-outlet>

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
export class KitComponent {
  #store = inject(Store);

  profile = this.#store.selectSignal(selectCurrentProfile);

  readonly outletSecondary = OUTLET_DIALOG;

  constructor() {
    console.log('KitComponent constructor');
    this.#store
      .pipe(
        select(selectCurrentProfile),
        filter(Boolean),
        distinctUntilKeyChanged('id'),
        takeUntilDestroyed()
      )
      .subscribe(() =>
        this.#store.dispatch(
          FeatFollowActions.getSuggestionColleaguesToFollow()
        )
      );
  }
}
