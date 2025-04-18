import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FeatSideBarPreviewComponent } from '@kitouch/containers';
import {
  FeatFarewellActions,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import {
  FeatFarewellInfoPanelComponent,
  FeatFarewellIntoComponent,
  FeatFarewellViewV2Component,
} from '@kitouch/feat-farewell-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Farewell, FarewellStatus, Profile } from '@kitouch/shared-models';
import { sortByCreatedTimeDesc } from '@kitouch/shared-services';
import {
  DividerComponent,
  UiCompGradientCardComponent,
  UiKitDeleteComponent,
} from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { combineLatest } from 'rxjs';

import { filter, map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-farewell-all',
  templateUrl: './all.component.html',
  styles: `
    :host {
      position: relative;
    }
  `,
  imports: [
    AsyncPipe,
    RouterModule,
    //
    FeatFarewellViewV2Component,
    DividerComponent,
    UiCompGradientCardComponent,
    UiKitDeleteComponent,
    FeatFarewellIntoComponent,
    FeatFarewellInfoPanelComponent,
    FeatSideBarPreviewComponent,
    //
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
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

  #currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter((profile): profile is Profile => !!profile?.id),
    takeUntilDestroyed()
  );

  farewells$ = combineLatest([
    this.#store.pipe(select(selectFarewells)),
    this.#currentProfile$,
  ]).pipe(
    map(([farewells, currentProfile]) =>
      farewells.filter(({ profile }) => profile.id === currentProfile.id)
    ),
    map((farewells) =>
      farewells
        .slice()
        .sort((a, b) =>
          sortByCreatedTimeDesc(
            a.createdAt ?? (a as any).timestamp?.createdAt,
            b.createdAt ?? (b as any).timestamp?.createdAt
          )
        )
    )
  );

  farewellStatus = FarewellStatus;

  // farewellsLoadingState = toSignal(
  //   objectLoadingState$<Farewell>({
  //     loadingAction$: (actions) =>
  //       actions.pipe(ofType(FeatFarewellActions.getProfileFarewells)),
  //     loadedAction$: (actions) =>
  //       actions.pipe(ofType(FeatFarewellActions.getFarewellsSuccess)),
  //     loadingErrorAction$: (actions) =>
  //       actions.pipe(ofType(FeatFarewellActions.getFarewellsFailure)),
  //   })
  // );

  constructor() {
    this.#currentProfile$.subscribe(({ id }) =>
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
