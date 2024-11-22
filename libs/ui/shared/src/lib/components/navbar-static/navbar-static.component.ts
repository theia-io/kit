import { Component, inject, input, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';

import { AsyncPipe } from '@angular/common';
import {
  APP_PATH,
  APP_PATH_STATIC_PAGES,
  DESKTOP_NAV_ITEMS,
} from '../../constants';
import { Device, DeviceService } from '../../infra/device/device.service';
import { UiLogoComponent } from '../logo/logo.component';
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
  styleUrl: './navbar-static.component.scss',
  templateUrl: './navbar-static.component.html',
})
export class SharedNavBarStaticComponent implements OnDestroy {
  fullBar = input(false);
  updatePrimengHighlight = input(false);

  #navbarService = inject(NavbarService);
  deviceService = inject(DeviceService);
  DeviceTypes = Device;

  navBarItems = DESKTOP_NAV_ITEMS.filter(
    (navItem) =>
      !navItem.separator &&
      ![`/${APP_PATH.Settings}`, `/${APP_PATH.Bookmarks}`].includes(
        navItem.routerLink
      )
  );
  homeUrl = `/${APP_PATH.Home}`;
  introduceKitUrl = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

  ngOnDestroy(): void {
    if (this.updatePrimengHighlight()) {
      this.#navbarService.triggerPrimengHighlight$.next();
    }
  }
}
