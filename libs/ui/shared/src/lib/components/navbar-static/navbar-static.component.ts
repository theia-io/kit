import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';

import { APP_PATH_STATIC_PAGES } from '../../constants';
import { UiLogoComponent } from '../logo/logo.component';

@Component({
  standalone: true,
  imports: [RouterModule, UiLogoComponent, UIKitSmallerHintTextUXDirective],
  selector: 'shared-navbar-static',
  templateUrl: './navbar-static.component.html',
})
export class SharedNavBarStaticComponent {
  fullBar = input(false);

  introduceKitUrl = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;
}
