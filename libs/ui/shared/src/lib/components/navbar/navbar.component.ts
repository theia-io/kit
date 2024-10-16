import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { selectCurrentProfile } from '@kitouch/kit-data';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { Store } from '@ngrx/store';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import {
  APP_PATH,
  APP_PATH_DIALOG,
  APP_PATH_STATIC_PAGES,
  NAV_ITEMS,
  OUTLET_DIALOG,
} from '../../constants';
import { AuthService, DeviceMediaBreakpoint, DeviceService } from '../../infra';
import { UXDynamicService } from '../../services/ux-dynamic.service';
import { UiLogoComponent } from '../logo/logo.component';
import { NavbarService } from './navbar.service';
import { SubnavComponent } from './subnav/subnav.component';
import { AsyncPipe } from '@angular/common';
import { LayoutService } from '../layout/layout.service';

const getFirstRoutePath = (url: string) => url.split('/')?.filter(Boolean)?.[0];

@Component({
  standalone: true,
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    //
    MenuModule,
    TagModule,
    /** Features */
    UiLogoComponent,
    UiCompCardComponent,
    DividerComponent,
    AccountTileComponent,
    UiKitTweetButtonComponent,
    SubnavComponent,
  ],
})
export class NavBarComponent implements AfterViewInit {
  sanitizer: DomSanitizer = inject(DomSanitizer);
  #elemRef = inject(ElementRef);
  #router = inject(Router);
  #store = inject(Store);
  //
  #authService = inject(AuthService);
  #uxDynamicService = inject(UXDynamicService);
  #navbarService = inject(NavbarService);
  #layoutService = inject(LayoutService);

  #menuItemNativeElemInitiallyFocused: HTMLLIElement | undefined;

  readonly outletSecondary = OUTLET_DIALOG;
  readonly navBarItems = NAV_ITEMS;
  readonly profileUrl = APP_PATH.Profile;
  readonly farewellUrl = APP_PATH.Farewell;
  readonly introducingKitFarewell = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;
  readonly suggestionUrl = APP_PATH.Suggestion;

  profile = this.#store.selectSignal(selectCurrentProfile);

  mobileNavbar$ = this.#layoutService.mobileNavbar$;

  constructor() {
    this.mobileNavbar$
      .pipe(
        filter((mobile) => !mobile),
        switchMap(() => this.#navbarService.triggerPrimengHighlight$)
      )
      .subscribe(() => this.#triggerPrimengHighlight());
  }

  ngAfterViewInit(): void {
    this.mobileNavbar$.pipe(filter((mobile) => !mobile)).subscribe(() => {
      this.#triggerPrimengHighlight();

      setTimeout(() => {
        this.#uxDynamicService.updateLogo('handshake', 5000);
      }, 500);
    });
  }

  tweetButtonHandler() {
    this.#router.navigate([
      { outlets: { [this.outletSecondary]: APP_PATH_DIALOG.Tweet } },
    ]);
  }

  createFarewellHandler() {
    this.#router.navigate([APP_PATH.Farewell, 'generate']);
  }

  async logoutHandler() {
    await this.#authService.logout();
    window.location.reload();
  }

  onFocusHandler(event: Event) {
    this.#menuItemNativeElemInitiallyFocused?.classList.remove('p-focus');
  }

  #triggerPrimengHighlight() {
    const firstLevelRoute = getFirstRoutePath(this.#router.url);
    const shouldInitiallyFocus = this.navBarItems.find(
      (navItem) =>
        navItem.routerLink &&
        getFirstRoutePath(navItem.routerLink) === firstLevelRoute
    );

    // well, obviously this should not focus like this however p-menu
    // does not allow any better way than that
    /** @FIXME (not is scope of fixme ticket) focus initial routing better */
    if (shouldInitiallyFocus) {
      (this.#elemRef.nativeElement as HTMLElement)
        .querySelectorAll('[role="menuitem"]')
        .forEach((menuItemNativeElem) => {
          if (
            menuItemNativeElem.getAttribute('aria-label') ===
            shouldInitiallyFocus.label
          ) {
            this.#menuItemNativeElemInitiallyFocused =
              menuItemNativeElem as HTMLLIElement;
            setTimeout(() => {
              this.#menuItemNativeElemInitiallyFocused?.classList.add(
                'p-focus'
              );
            }, 200);
          }
        });
    }
  }
}
