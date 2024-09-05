import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  FeatFarewellActions,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import { FeatFarewellPreViewComponent } from '@kitouch/feat-farewell-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Farewell, Profile } from '@kitouch/shared-models';
import {
  DividerComponent,
  UiCompGradientCardComponent,
  UiKitDeleteComponent,
} from '@kitouch/ui-components';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
    ConfirmDialogModule,
    //
    FeatFarewellPreViewComponent,
    DividerComponent,
    UiCompGradientCardComponent,
    UiKitDeleteComponent,
    //
  ],
  providers: [ConfirmationService, MessageService],
})
export class PageFarewellAllComponent {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #messageService = inject(MessageService);

  farewellUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.Farewell}`;
  farewellGenerate = `/${APP_PATH.Farewell}/generate`;
  farewellEdit = `/${APP_PATH.Farewell}/edit`;

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

  onDeleteHandler(farewell: Farewell, event: Event) {
    this.#confirmationService.confirm({
      target: event.target as EventTarget,
      // TODO Add functionality to show analytics (and possibly prevent unneeded or unintended deletions)
      //  `It has ${farewell.viewed} views.`
      message: `
        Do you want to delete "${farewell.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.#messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: `${farewell.title} is deleted.`,
        });
        this.#store.dispatch(
          FeatFarewellActions.deleteFarewell({ id: farewell.id })
        );
      },
      reject: () => {
        this.#messageService.add({
          severity: 'info',
          summary: 'Was not deleted',
          detail: `${farewell.title} was not deleted.`,
        });
      },
    });
  }
}
