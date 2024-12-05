import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

import {
  APP_PATH,
  APP_PATH_STATIC_PAGES,
  DESKTOP_NAV_ITEMS,
} from '@kitouch/shared-constants';
import { Device, DeviceService } from '@kitouch/shared-infra';
import { UiLogoComponent } from '../logo/logo.component';
import { NavbarService } from '../navbar/navbar.service';
import { Button, ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    NgClass,
    OverlayPanelModule,
    ButtonModule,
    //
    UiLogoComponent,
    UIKitSmallerHintTextUXDirective,
  ],
  selector: 'shared-navbar-static',
  styleUrl: './navbar-static.component.scss',
  templateUrl: './navbar-static.component.html',
})
export class SharedNavBarStaticComponent implements OnDestroy {
  userLoggedIn = input.required<boolean>();
  hideLogin = input(false);
  /** This is system variable and can be considered to be removed */
  _sysUpdatePrimengHighlight = input(false);

  #navbarService = inject(NavbarService);
  deviceService = inject(DeviceService);

  @ViewChild(OverlayPanel)
  opEl: OverlayPanel;

  navBarItems = DESKTOP_NAV_ITEMS.filter(
    (navItem) =>
      !navItem.separator &&
      ![`/${APP_PATH.Settings}`, `/${APP_PATH.Bookmarks}`].includes(
        navItem.routerLink
      )
  );
  featuresOpened = signal(false);

  deviceTypes = Device;
  homeUrl = `/${APP_PATH.Home}`;
  loginUrl = `/s/${APP_PATH_STATIC_PAGES.SignIn}`;
  introduceKitUrl = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;
  featuresConnectedUrl = `/s/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesConnected}`;

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

  ngOnDestroy(): void {
    if (this._sysUpdatePrimengHighlight()) {
      this.#navbarService.triggerPrimengHighlight$.next();
    }
  }

  handleFeaturesClick(event: Event) {
    const opened = this.featuresOpened();
    if (opened) {
      this.opEl.hide();
    } else {
      this.opEl.show(event);
    }
  }
}
