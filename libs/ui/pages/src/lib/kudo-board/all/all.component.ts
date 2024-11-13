import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  FeatKudoBoardActions,
  selectKudoBoards,
} from '@kitouch/data-kudoboard';
import { FeatFarewellAllGridItemComponent } from '@kitouch/feat-farewell-ui';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { KudoBoard, KudoBoardStatus, Profile } from '@kitouch/shared-models';
import { DividerComponent, UiKitDeleteComponent } from '@kitouch/ui-components';
import { FeatKudoBoardAnalyticsComponent } from '@kitouch/ui-kudoboard';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { combineLatest } from 'rxjs';

import { filter, map } from 'rxjs/operators';

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
    RouterModule,
    DatePipe,
    //
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    //
    FeatKudoBoardAnalyticsComponent,
    DividerComponent,
    FeatFarewellAllGridItemComponent,
    UiKitDeleteComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class PageKudoBoardsAllComponent {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #messageService = inject(MessageService);

  #currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter((profile): profile is Profile => !!profile?.id),
    takeUntilDestroyed()
  );

  myKudos$ = combineLatest([
    this.#store.pipe(select(selectKudoBoards)),
    this.#currentProfile$,
  ]).pipe(
    map(([kudos, currentProfile]) =>
      kudos.filter(
        ({ profileId, profile }) =>
          (profileId ?? profile?.id ?? null) === currentProfile.id
      )
    ),
    map((kudoboards) =>
      kudoboards
        .slice()
        .sort(
          (a, b) =>
            new Date(b.timestamp?.createdAt?.toString()).getTime() -
            new Date(a.timestamp?.createdAt?.toString()).getTime()
        )
    )
  );

  kudoBoardGenerateUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/generate`;
  readonly kudoBoardPartialUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
  readonly kudoBoardStatus = KudoBoardStatus;

  constructor() {
    this.#currentProfile$.subscribe(({ id }) =>
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
