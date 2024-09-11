import { Component, inject, input, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';

import { APP_PATH, APP_PATH_STATIC_PAGES, NAV_ITEMS } from '../../constants';
import { UiLogoComponent } from '../logo/logo.component';
import { Device, DeviceService } from '../../infra/device/device.service';
import { AsyncPipe } from '@angular/common';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    //
    UiLogoComponent,
    UIKitSmallerHintTextUXDirective,
  ],
  selector: 'shared-navbar-static',
  templateUrl: './navbar-static.component.html',
})
export class SharedNavBarStaticComponent implements OnDestroy {
  fullBar = input(false);
  updatePrimengHighlight = input(false);

  #navbarService = inject(NavbarService);
  deviceService = inject(DeviceService);
  DeviceTypes = Device;

  navBarItems = NAV_ITEMS.filter((navItem) => !navItem.separator);
  homeUrl = `/${APP_PATH.Home}`;
  introduceKitUrl = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;

  ngOnDestroy(): void {
    if (this.updatePrimengHighlight()) {
      this.#navbarService.triggerPrimengHighlight$.next();
    }
  }
}
