import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
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
import { SubnavComponent } from './subnav/subnav.component';

const STATIC_MEDIA = 'logo/handshake-s-small.png';
const DYNAMIC_MEDIA = 'logo/handshake.gif';

@Component({
  standalone: true,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    //
    MenuModule,
    TagModule,
    /** Features */
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

  sanitizer: DomSanitizer = inject(DomSanitizer);

  #elemRef = inject(ElementRef);
  #menuItemNativeElemInitiallyFocused: HTMLLIElement | undefined;

  farewellUrl = APP_PATH.Farewell;

  logoPath = signal(STATIC_MEDIA);

  constructor() {
    effect(() => {
      if (this.logoPath() === DYNAMIC_MEDIA) {
        setTimeout(() => {
          this.logoPath.set(STATIC_MEDIA);
        }, 20_000);
      }
    });
  }

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
      this.logoPath.set(DYNAMIC_MEDIA);
    }, 1500);
  }

  onFocusHandler(event: Event) {
    this.#menuItemNativeElemInitiallyFocused?.classList.remove('p-focus');
  }
}
