import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { kudoboardLink } from '@kitouch/containers';
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
    navigator.clipboard.writeText(
      kudoboardLink(this.#document.location.origin, kudoboardId, recipient)
    );

    const animationState = recipient ? this.copiedRecipient : this.copied;

    animationState.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      animationState.set(false);
    }, 5000);
  }
}
