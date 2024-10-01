import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeatFarewellComponent } from '@kitouch/feat-farewell-ui';
import { UiKitDeleteComponent } from '@kitouch/ui-components';
import {
  APP_PATH,
  NavbarService,
  RouterEventsService,
  SharedNavBarStaticComponent,
} from '@kitouch/ui-shared';
import { SidebarModule } from 'primeng/sidebar';
import { take } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './farewell-generate.component.html',
  imports: [
    //
    UiKitDeleteComponent,
    SharedNavBarStaticComponent,
    FeatFarewellComponent,
    //
    SidebarModule,
  ],
})
export class PageFarewellGenerateComponent {
  #router = inject(Router);
  #routerEventsService = inject(RouterEventsService);
  #navbarService = inject(NavbarService);

  constructor() {
    console.log('FAREWELlPAGE GENERATE');
  }

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
