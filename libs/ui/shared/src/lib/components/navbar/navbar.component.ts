import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
  output
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Profile } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui/components';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { SubnavComponent } from './subnav/subnav.component';

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
    /** Features */
    UiCompCardComponent,
    SubnavComponent,
    DividerComponent,
    AccountTileComponent,
    UiKitTweetButtonComponent,
  ],
})
export class NavBarComponent implements AfterViewInit {
  items = input<Array<MenuItem & { kitShouldInitiallyBeFocused?: boolean }>>(
    []
  );

  @Input()
  profileBaseUrl: string;

  @Input()
  profile: Partial<Profile> | undefined | null;

  @Output()
  logout = new EventEmitter<void>();

  @Output()
  help = new EventEmitter<void>();

  tweetButtonClick = output();

  sanitizer: DomSanitizer = inject(DomSanitizer);

  #elemRef = inject(ElementRef);
  #menuItemNativeElemInitiallyFocused: HTMLLIElement | undefined;

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
  }

  onFocusHandler(event: Event) {
    this.#menuItemNativeElemInitiallyFocused?.classList.remove('p-focus');
  }
}
