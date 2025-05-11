import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { capitalizeFirstLetter } from '@kitouch/shared-services';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { farewellLink, kudoboardLink } from './share';

@Component({
  selector: 'shared-copy-clipboard',
  templateUrl: './share.component.html',
  imports: [ButtonModule, TooltipModule, ToastModule],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedCopyClipboardComponent {
  id = input.required<string>();
  type = input.required<'farewell' | 'kudoboard'>();
  gifting = input<boolean>(false);
  bigger = input<boolean>(false);

  #document = inject(DOCUMENT);
  #messageService = inject(MessageService);

  linkCopied = signal(false);

  copyToClipBoard() {
    const originalUrl = this.#document.location.origin;
    const url =
      this.type() === 'farewell'
        ? farewellLink(originalUrl, this.id())
        : kudoboardLink(originalUrl, this.id(), this.gifting());
    navigator.clipboard.writeText(url);

    this.linkCopied.set(true);
    // TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.linkCopied.set(false);
    }, 5000);

    this.#messageService.clear();
    this.#messageService.add({
      severity: 'info',
      summary: `${capitalizeFirstLetter(this.type())} link saved to clipboard`,
      detail: `You can share this ${this.type()} link with your (ex-) colleagues and friends!`,
      life: 5000,
    });
  }
}
