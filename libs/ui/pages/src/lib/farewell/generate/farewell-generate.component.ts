import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeatFarewellGenerateComponent } from '@kitouch/feat-farewell-ui';
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
    // ReactiveFormsModule,
    RouterModule,
    //
    SharedNavBarStaticComponent,
    FeatFarewellGenerateComponent,
    //
    SidebarModule,
  ],
})
export class PageFarewellGenerateComponent {
  #router = inject(Router);
  #routerEventsService = inject(RouterEventsService);
  #navbarService = inject(NavbarService);

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
