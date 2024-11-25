import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  SharedNavBarStaticComponent,
  NavbarService,
} from '@kitouch/containers';
import { FeatFarewellComponent } from '@kitouch/feat-farewell-ui';
import { APP_PATH } from '@kitouch/shared-constants';
import { RouterEventsService } from '@kitouch/shared-infra';
import { UiKitDeleteComponent } from '@kitouch/ui-components';
import { SidebarModule } from 'primeng/sidebar';
import { take } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './farewell-generate.component.html',
  imports: [
    NgTemplateOutlet,
    //
    UiKitDeleteComponent,
    SharedNavBarStaticComponent,
    FeatFarewellComponent,
    //
    SidebarModule,
  ],
})
/** @TODO @FIXME Merge PageFarewellGenerateComponent and PageFarewellEditComponent components */
export class PageFarewellGenerateComponent {
  #router = inject(Router);
  #routerEventsService = inject(RouterEventsService);
  #navbarService = inject(NavbarService);

  statusTmpl?: TemplateRef<any>;

  redirectToLatest() {
    this.#routerEventsService.lastUrlSaved$
      .pipe(take(1))
      .subscribe((latestUrl) => {
        this.#router
          .navigateByUrl(latestUrl ?? APP_PATH.Farewell)
          .then(() => this.#navbarService.triggerPrimengHighlight$.next());
      });
  }
}
