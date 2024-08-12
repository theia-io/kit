import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  FeatFarewellActions,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import { FeatFarewellViewComponent } from '@kitouch/feat-farewell-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Farewell, Profile } from '@kitouch/shared-models';
import {
  DividerComponent,
  UiCompGradientCardComponent,
  UiKitDeleteComponent,
} from '@kitouch/ui-components';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
    //
    FeatFarewellViewComponent,
    DividerComponent,
    UiCompGradientCardComponent,
    UiKitDeleteComponent,
    //
  ],
})
export class PageFarewellAllComponent {
  #store = inject(Store);

  farewellUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.Farewell}`;
  farewellGenerate = `/${APP_PATH.Farewell}/generate`;
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

  onDeleteHandler({ id }: Farewell) {
    this.#store.dispatch(FeatFarewellActions.deleteFarewell({ id }));
  }
}
