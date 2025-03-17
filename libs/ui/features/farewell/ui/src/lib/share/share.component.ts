import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Farewell } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { farewellLink } from './share';

@Component({
  standalone: true,
  selector: 'feat-farewell-share',
  templateUrl: './share.component.html',
  imports: [
    //
    ButtonModule,
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellShareComponent {
  id = input.required<Farewell['id']>();

  #document = inject(DOCUMENT);

  linkCopied = signal(false);

  copyToClipBoard(farewellId: string) {
    navigator.clipboard.writeText(
      farewellLink(this.#document.location.origin, farewellId)
    );

    this.linkCopied.set(true);
    // TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.linkCopied.set(false);
    }, 5000);
  }
}
