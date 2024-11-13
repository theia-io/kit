import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Farewell } from '@kitouch/shared-models';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  standalone: true,
  selector: 'feat-farewell-share',
  templateUrl: './share.component.html',
  imports: [
    //
    ButtonModule,
    OverlayPanelModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellShareComponent {
  id = input.required<Farewell['id']>();

  #document = inject(DOCUMENT);

  linkCopied = signal(false);

  copyToClipBoard(kudoboardId: string) {
    navigator.clipboard.writeText(this.#url(kudoboardId));

    this.linkCopied.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.linkCopied.set(false);
    }, 5000);
  }

  #url(farewellId: string) {
    return [
      this.#document.location.origin,
      's',
      APP_PATH_ALLOW_ANONYMOUS.Farewell,
      farewellId,
    ].join('/');
  }
}
