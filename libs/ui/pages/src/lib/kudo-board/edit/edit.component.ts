import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedNavBarStaticComponent } from '@kitouch/containers';
import {
  FeatKudoBoardActions,
  selectKudoBoardById,
} from '@kitouch/data-kudoboard';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { UiKitDeleteComponent } from '@kitouch/ui-components';
import { FeatKudoBoardEditComponent } from '@kitouch/ui-kudoboard';

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
    //
    SidebarModule,
    BreadcrumbModule,
  ],
})
export class PageKudoBoardEditComponent {
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);

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
        routerLink: `/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
        icon: 'pi pi-send mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: kudoboard.title,
      },
    ])
  );

  statusTmpl?: TemplateRef<unknown>;
  shareTmpl?: TemplateRef<unknown>;

  constructor() {
    this.kudoBoardId$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.#store.dispatch(FeatKudoBoardActions.getKudoBoard({ id }))
      );
  }

  redirectToAll() {
    this.#router.navigateByUrl(APP_PATH_ALLOW_ANONYMOUS.KudoBoard);
  }
}
