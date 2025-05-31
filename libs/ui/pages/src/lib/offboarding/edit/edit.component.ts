import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedNavBarStaticComponent } from '@kitouch/containers';
import {
  FeatExpOffboardingActions,
  selectExpOffboardingById,
} from '@kitouch/feat-offboarding-data';
import {
  FeatOffboardingEditComponent,
  FeatOffboardingStatusComponent,
} from '@kitouch/feat-offboarding-ui';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
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
  selector: 'kit-page-offboarding-edit',
  templateUrl: './edit.component.html',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    //
    FeatOffboardingEditComponent,
    UiKitDeleteComponent,
    SharedNavBarStaticComponent,
    UiKitSpinnerComponent,
    FeatOffboardingStatusComponent,
    //
    SidebarModule,
    BreadcrumbModule,
  ],
})
export class PageOffboardingEditComponent {
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);

  loggedIn$ = this.#auth0Service.loggedIn$;

  offboardingId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    filter(Boolean),
    shareReplay()
  );

  offboarding$ = this.offboardingId$.pipe(
    switchMap((id) => this.#store.pipe(select(selectExpOffboardingById(id)))),
    filter(Boolean)
  );

  currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter(Boolean)
  );

  offboardingCreator$ = combineLatest([
    this.offboarding$,
    this.currentProfile$,
  ]).pipe(
    map(
      ([offboarding, profile]) =>
        (offboarding.profileId ?? offboarding.profile?.id) === profile.id
    ),
    startWith(false)
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.offboarding$,
  ]).pipe(
    map(([_, offboarding]) => [
      {
        label: 'All Offboardings',
        routerLink: `/app/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}`,
        icon: 'pi pi-heart-fill mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: offboarding.title,
      },
    ])
  );

  updating = signal(false);

  doneTmpl?: TemplateRef<unknown>;
  statusTmpl?: TemplateRef<unknown>;
  previewTmpl?: TemplateRef<unknown>;
  shareTmpl?: TemplateRef<unknown>;

  constructor() {
    this.offboardingId$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.#store.dispatch(
          FeatExpOffboardingActions.getExpOffboarding({ id })
        )
      );
  }

  redirectToAll() {
    this.#router.navigateByUrl(`/app/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}`);
  }

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
