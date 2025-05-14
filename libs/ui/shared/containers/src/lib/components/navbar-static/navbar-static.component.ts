import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnDestroy,
  output,
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
import { Device, DeviceService, ENVIRONMENT } from '@kitouch/shared-infra';
import { ButtonModule } from 'primeng/button';
import { UiLogoComponent } from '../logo/logo.component';
import { NavbarService } from '../navbar/navbar.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    NgClass,
    NgOptimizedImage,
    OverlayPanelModule,
    ButtonModule,
    TooltipModule,
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
  // TODO: address below
  /** This is system variable and can be considered to be removed */
  _sysUpdatePrimengHighlight = input(false);

  getStarted = output<void>();

  #navbarService = inject(NavbarService);
  deviceService = inject(DeviceService);
  environment = inject(ENVIRONMENT);

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
  homeUrl = `/${APP_PATH.Feed}`;
  loginUrl = `/${APP_PATH_STATIC_PAGES.SignIn}`;
  introduceKitUrl = `/${APP_PATH_STATIC_PAGES.IntroduceKit}`;
  featuresConnectedUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesConnected}`;
  featuresKudoboardUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesKudoboard}`;
  featuresFarewellUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesFarewell}`;

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

  handleGetStarted() {
    this.getStarted.emit();
  }
}
