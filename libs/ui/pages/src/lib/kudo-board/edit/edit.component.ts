import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedNavBarStaticComponent } from '@kitouch/containers';
import {
  FeatKudoBoardActions,
  selectKudoBoardById,
} from '@kitouch/data-kudoboard';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import {
  UiKitDeleteComponent,
  UiKitSpinnerComponent,
} from '@kitouch/ui-components';
import {
  FeatKudoBoardEditComponent,
  FeatKudoBoardStatusComponent,
} from '@kitouch/ui-kudoboard';

import { select, Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SidebarModule } from 'primeng/sidebar';
import { combineLatest, Observable } from 'rxjs';

import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-kudo-board-edit',
  templateUrl: './edit.component.html',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    //
    UiKitDeleteComponent,
    SharedNavBarStaticComponent,
    FeatKudoBoardEditComponent,
    FeatKudoBoardStatusComponent,
    UiKitSpinnerComponent,
    //
    SidebarModule,
    BreadcrumbModule,
  ],
})
export class PageKudoBoardEditComponent {
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);

  loggedIn$ = this.#auth0Service.loggedIn$;

  kudoBoardId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    filter(Boolean),
    shareReplay()
  );

  kudoBoard$ = this.kudoBoardId$.pipe(
    switchMap((id) => this.#store.pipe(select(selectKudoBoardById(id)))),
    filter(Boolean)
  );

  currentProfile$ = this.#store.pipe(
    select(selectCurrentProfile),
    filter(Boolean)
  );

  kudoboardCreator$ = combineLatest([
    this.kudoBoard$,
    this.currentProfile$,
  ]).pipe(
    map(
      ([kudoboard, profile]) =>
        (kudoboard.profileId ?? kudoboard.profile?.id) === profile.id
    ),
    startWith(false)
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.kudoBoard$,
  ]).pipe(
    map(([_, kudoboard]) => [
      {
        label: 'All KudoBoards',
        routerLink: `/app/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
        icon: 'pi pi-send mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: kudoboard.title,
      },
    ])
  );

  updating = signal(false);

  doneTmpl?: TemplateRef<unknown>;
  statusTmpl?: TemplateRef<unknown>;
  previewTmpl?: TemplateRef<unknown>;
  shareTmpl?: TemplateRef<unknown>;

  constructor() {
    this.kudoBoardId$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.#store.dispatch(FeatKudoBoardActions.getKudoBoard({ id }))
      );
  }

  redirectToAll() {
    this.#router.navigateByUrl(`/app/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`);
  }

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
