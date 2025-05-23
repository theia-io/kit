import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs';

import {
  APP_PATH,
  APP_PATH_ALLOW_ANONYMOUS,
  APP_PATH_DIALOG,
  APP_PATH_STATIC_PAGES,
  DESKTOP_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
  OUTLET_DIALOG,
} from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { UXDynamicService } from '@kitouch/shared-services';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { LayoutService } from '../layout/layout.service';
import { UiLogoComponent } from '../logo/logo.component';
import { NavbarService } from './navbar.service';
import { SubnavComponent } from './subnav/subnav.component';
import { profilePicture } from '@kitouch/kit-data';

const getFirstRoutePath = (url: string) => url.split('/')?.filter(Boolean)?.[1];

@Component({
  standalone: true,
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterModule,
    //
    MenuModule,
    ButtonModule,
    SidebarModule,
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
  profile = input.required<Profile | undefined>();

  sanitizer: DomSanitizer = inject(DomSanitizer);
  #elemRef = inject(ElementRef);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  //
  #auth0Service = inject(Auth0Service);
  #uxDynamicService = inject(UXDynamicService);
  #navbarService = inject(NavbarService);
  #layoutService = inject(LayoutService);

  #menuItemNativeElemInitiallyFocused: HTMLLIElement | undefined;

  readonly profileUrl = `/${APP_PATH.Profile}/`;
  readonly farewellUrl = `/${APP_PATH.Farewell}`;
  readonly kudoBoardAllUrl = `/app/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
  readonly introducingKitFarewell = `/${APP_PATH_STATIC_PAGES.IntroduceKit}`;
  readonly suggestionUrl = APP_PATH.Suggestion;

  desktopItems = DESKTOP_NAV_ITEMS;
  mobileNavbar$ = this.#layoutService.mobileNavbar$;
  sidebarVisible = signal(false);
  navBarItems$ = this.mobileNavbar$.pipe(
    map((isMobile) => (isMobile ? MOBILE_NAV_ITEMS : DESKTOP_NAV_ITEMS)),
    startWith(DESKTOP_NAV_ITEMS),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  profilePicture = profilePicture;

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
    this.#router.navigate(
      [
        {
          outlets: {
            [OUTLET_DIALOG]: [APP_PATH_DIALOG.Tweet],
          },
        },
      ],
      {
        relativeTo: this.#route,
      }
    );
  }

  toggleSideBar(openOrClose?: boolean) {
    if (openOrClose == undefined) {
      this.sidebarVisible.update((current) => !current);
      return;
    }

    this.sidebarVisible.set(openOrClose);
  }

  async logoutHandler() {
    await this.#auth0Service.logout();
  }

  onFocusHandler() {
    this.#menuItemNativeElemInitiallyFocused?.classList.remove('p-focus');
  }

  #triggerPrimengHighlight() {
    const firstLevelRoute = getFirstRoutePath(this.#router.url);
    const shouldInitiallyFocus = DESKTOP_NAV_ITEMS.find(
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
