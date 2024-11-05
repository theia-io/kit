import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  FeatKudoBoardActions,
  selectKudoBoards,
} from '@kitouch/data-kudoboard';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { KudoBoard, Profile } from '@kitouch/shared-models';
import {
  DividerComponent,
  UiCompGradientCardComponent,
  UiKitDeleteComponent,
} from '@kitouch/ui-components';
import {
  FeatKudoBoardAnalyticsComponent,
  FeatKudoBoardViewComponent,
} from '@kitouch/ui-kudoboard';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-kudo-boards-all',
  templateUrl: './all.component.html',
  styles: `
    :host {
      position: relative;
    }
  `,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterModule,
    //
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    //
    DividerComponent,
    UiCompGradientCardComponent,
    UiKitDeleteComponent,
    FeatKudoBoardViewComponent,
    FeatKudoBoardAnalyticsComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class PageKudoBoardsAllComponent {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #messageService = inject(MessageService);

  kudoBoardPartialUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
  kudoBoardGenerateUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/generate`;
  kudoBoardAllUrl = `/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;

  myKudos$ = this.#store.pipe(select(selectKudoBoards));

  constructor() {
    this.#store
      .pipe(
        select(selectCurrentProfile),
        filter((profile): profile is Profile => !!profile?.id),
        takeUntilDestroyed()
      )
      .subscribe(({ id }) =>
        this.#store.dispatch(
          FeatKudoBoardActions.getProfileKudoBoards({ profileId: id })
        )
      );
  }

  onDeleteHandler(kudoboard: KudoBoard, event: Event) {
    this.#confirmationService.confirm({
      target: event.target as EventTarget,
      // TODO Add functionality to show analytics (and possibly prevent unneeded or unintended deletions)
      //  `It has ${kudoboard.viewed} views.`
      message: `
        Do you want to delete "${kudoboard.title}"?`,
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
          detail: `${kudoboard.title} is deleted.`,
        });
        this.#store.dispatch(
          FeatKudoBoardActions.deleteKudoBoard({ id: kudoboard.id })
        );
      },
      reject: () => {
        this.#messageService.add({
          severity: 'info',
          summary: 'Was not deleted',
          detail: `${kudoboard.title} was not deleted.`,
        });
      },
    });
  }
}
