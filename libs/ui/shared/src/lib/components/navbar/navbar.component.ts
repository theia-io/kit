import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Profile } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { APP_PATH } from '../../constants';
import { UXDynamicService } from '../../services/ux-dynamic.service';
import { SubnavComponent } from './subnav/subnav.component';
import { UiLogoComponent } from '../logo/logo.component';

@Component({
  standalone: true,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
  items = input<Array<MenuItem & { kitShouldInitiallyBeFocused?: boolean }>>(
    []
  );

  profileBaseUrl = input.required<string>();
  profile = input<Profile | undefined | null>(null);

  logout = output();
  help = output();
  tweetButtonClick = output();

  uxDynamicService = inject(UXDynamicService);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  #elemRef = inject(ElementRef);
  #menuItemNativeElemInitiallyFocused: HTMLLIElement | undefined;

  farewellUrl = APP_PATH.Farewell;

  ngAfterViewInit(): void {
    const shouldInitiallyFocus = this.items().find(
      (item) => item.kitShouldInitiallyBeFocused
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

    setTimeout(() => {
      this.uxDynamicService.updateLogo('handshake', 5000);
    }, 500);
  }

  onFocusHandler(event: Event) {
    this.#menuItemNativeElemInitiallyFocused?.classList.remove('p-focus');
  }
}
