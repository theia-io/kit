import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { KudoBoard } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-view-additional-actions',
  templateUrl: './view-additional-actions.component.html',
  imports: [ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardViewAdditionalActionsComponent {
  id = input.required<KudoBoard['id']>();

  #document = inject(DOCUMENT);

  copied = signal(false);
  copiedRecipient = signal(false);

  copyToClipBoard(kudoboardId: string, recipient: boolean) {
    navigator.clipboard.writeText(this.#url(kudoboardId, recipient));

    const animationState = recipient ? this.copiedRecipient : this.copied;

    animationState.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      animationState.set(false);
    }, 5000);
  }

  #url(kudoboardId: string, recipient: boolean) {
    return (
      [
        this.#document.location.origin,
        's',
        APP_PATH_ALLOW_ANONYMOUS.KudoBoard,
        kudoboardId,
      ].join('/') + (recipient ? '?view=true' : '')
    );
  }
}
