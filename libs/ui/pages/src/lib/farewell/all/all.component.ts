import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterModule } from '@angular/router';
import {
  FeatFarewellActions,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { APP_PATH } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';

import { TableModule } from 'primeng/table';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-farewell-all',
  templateUrl: './all.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterModule,
    //
    TableModule,
    //
  ],
})
export class PageFarewellAllComponent {
  #store = inject(Store);

  farewellUrl = APP_PATH.PublicFarewell;
  farewells$ = this.#store.pipe(select(selectFarewells));

  constructor() {
    this.#store
      .pipe(
        select(selectCurrentProfile),
        filter((profile): profile is Profile => !!profile?.id),
        takeUntilDestroyed()
      )
      .subscribe(({ id }) =>
        this.#store.dispatch(
          FeatFarewellActions.getProfileFarewells({ profileId: id })
        )
      );
  }
}