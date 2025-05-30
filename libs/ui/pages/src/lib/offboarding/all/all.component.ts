import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  FeatSideBarPreviewComponent,
  SharedCopyClipboardComponent,
  SharedStatusLegendComponent,
} from '@kitouch/containers';

import {
  FeatExpOffboardingActions,
  selectExpOffboardings,
} from '@kitouch/feat-offboarding-data';
import { FeatOffboardingInfoPanelComponent } from '@kitouch/feat-offboarding-ui';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import {
  ExpOffboarding,
  ExpOffboardingStatus,
  Profile,
} from '@kitouch/shared-models';

import { sortByCreatedTimeDesc } from '@kitouch/shared-services';
import {
  DividerComponent,
  UiCompCardComponent,
  UiCompGradientCardComponent,
  UiKitDeleteComponent,
  UiKitTweetButtonComponent,
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
  selector: 'kit-page-offboarding-all',
  templateUrl: './all.component.html',
  styles: `
    :host {
      position: relative;
    }
  `,
  imports: [
    DividerComponent,
    UiKitDeleteComponent,
    UiCompGradientCardComponent,
    FeatSideBarPreviewComponent,
    FeatOffboardingInfoPanelComponent,
    SharedCopyClipboardComponent,
    SharedStatusLegendComponent,
    UiCompCardComponent,
    UiKitTweetButtonComponent,
    //
    AsyncPipe,
    RouterModule,
    //
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class PageOffboardingAllComponent {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #messageService = inject(MessageService);

  #currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter((profile): profile is Profile => !!profile?.id),
    takeUntilDestroyed()
  );

  myOffboardings$ = combineLatest([
    this.#store.pipe(select(selectExpOffboardings)),
    this.#currentProfile$,
  ]).pipe(
    map(([offboardings, currentProfile]) =>
      offboardings.filter(({ profileId }) => profileId === currentProfile.id)
    ),
    map((offboardings) =>
      offboardings
        .slice()
        .sort((a, b) => sortByCreatedTimeDesc(a.createdAt, b.createdAt))
    )
  );

  offboardingGenerateUrl = `/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}/generate`;
  readonly offboardingPartialUrl = `/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}`;
  readonly offboardingStatus = ExpOffboardingStatus;

  constructor() {
    this.#currentProfile$.subscribe(({ id }) =>
      this.#store.dispatch(
        FeatExpOffboardingActions.getProfileExpOffboardings({ profileId: id })
      )
    );
  }

  onDeleteHandler({ title, id }: ExpOffboarding, event: Event) {
    this.#confirmationService.confirm({
      target: event.target as EventTarget,
      // TODO Add functionality to show analytics (and possibly prevent unneeded or unintended deletions)
      //  `It has ${offboarding.viewed} views.`
      message: `
        Do you want to delete "${title}"?`,
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
          detail: `${title} is deleted.`,
        });
        this.#store.dispatch(
          FeatExpOffboardingActions.deleteExpOffboarding({ id })
        );
      },
      reject: () => {
        this.#messageService.add({
          severity: 'info',
          summary: 'Was not deleted',
          detail: `${title} was not deleted.`,
        });
      },
    });
  }
}
