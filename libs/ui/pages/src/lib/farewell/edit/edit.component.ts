import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedNavBarStaticComponent } from '@kitouch/containers';
import {
  FeatFarewellActions,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
import {
  FeatFarewellComponent,
  FeatFarewellStatusComponent,
} from '@kitouch/feat-farewell-ui';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import {
  UiKitDeleteComponent,
  UiKitSpinnerComponent,
} from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SidebarModule } from 'primeng/sidebar';
import { combineLatest, Observable } from 'rxjs';

import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-farewell-edit',
  templateUrl: './edit.component.html',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    //
    UiKitDeleteComponent,
    SharedNavBarStaticComponent,
    FeatFarewellComponent,
    FeatFarewellStatusComponent,
    UiKitSpinnerComponent,
    //
    SidebarModule,
    BreadcrumbModule,
  ],
})
/** @TODO @FIXME Merge PageFarewellGenerateComponent and PageFarewellEditComponent components */
export class PageFarewellEditComponent {
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);
  #auth0Service = inject(Auth0Service);
  #store = inject(Store);

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    filter(Boolean),
    shareReplay()
  );

  farewell$ = this.farewellId$.pipe(
    switchMap((id) => this.#store.pipe(select(selectFarewellById(id)))),
    filter(Boolean)
  );

  currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter(Boolean)
  );

  farewellCreator$ = combineLatest([this.farewell$, this.currentProfile$]).pipe(
    map(([farewell, profile]) => farewell.profileId === profile.id),
    startWith(false)
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.farewell$,
  ]).pipe(
    map(([_, farewell]) => [
      {
        label: 'All Farewells',
        routerLink: `/${APP_PATH.Farewell}`,
        icon: 'pi pi-send mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: farewell.title,
      },
    ])
  );

  updating = signal(false);

  statusTmpl?: TemplateRef<unknown>;
  shareTmpl?: TemplateRef<unknown>;
  previewTmpl?: TemplateRef<unknown>;

  constructor() {
    this.farewellId$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.#store.dispatch(FeatFarewellActions.getFarewell({ id }))
      );
  }

  redirectToAll() {
    this.#router.navigateByUrl(APP_PATH.Farewell);
  }

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
