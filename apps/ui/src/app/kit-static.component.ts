import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UIKitLinkUXDirective } from '@kitouch/ui-components';
import { APP_PATH_STATIC_PAGES, UiLogoComponent } from '@kitouch/ui-shared';

@Component({
  standalone: true,
  imports: [RouterModule, UiLogoComponent, UIKitLinkUXDirective],
  selector: 'app-kitouch-static',
  template: ` <div class="p-4">
    <div class="flex items-center">
      <ui-shared-logo class="block mr-16" logoText="kit" />

      <a
        role="button"
        [routerLink]="introduceKitUrl"
        routerLinkActive="primeng-menu__active"
        pTooltip="Generate Farewell"
        uiKitLinkUX
      >
        What is Kit?
      </a>
    </div>

    <router-outlet></router-outlet>
  </div>`,
})
export class KitStaticComponent {
  introduceKitUrl = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;
}
