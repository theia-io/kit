import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FeatKudoBoardActions,
  selectKudoBoardById,
} from '@kitouch/data-kudoboard';

import { selectCurrentProfile } from '@kitouch/kit-data';
import { UiKitDeleteComponent } from '@kitouch/ui-components';
import { FeatKudoBoardEditComponent } from '@kitouch/ui-kudoboard';
import {
  APP_PATH_ALLOW_ANONYMOUS,
  SharedNavBarStaticComponent,
} from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { SidebarModule } from 'primeng/sidebar';
import { combineLatest } from 'rxjs';

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

  statusTmpl?: TemplateRef<unknown>;

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
