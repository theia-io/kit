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
import { capitalizeFirstLetter } from '@kitouch/shared-services';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-view-additional-actions',
  templateUrl: './view-additional-actions.component.html',
  imports: [ButtonModule, ToastModule],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardViewAdditionalActionsComponent {
  id = input.required<KudoBoard['id']>();

  #document = inject(DOCUMENT);
  #messageService = inject(MessageService);

  copiedGift = signal(false);
  copiedShare = signal(false);

  copyToClipBoard(kudoboardId: string, giftLink: boolean) {
    navigator.clipboard.writeText(
      kudoboardLink(this.#document.location.origin, kudoboardId, giftLink)
    );

    const animationState = giftLink ? this.copiedGift : this.copiedShare;

    animationState.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      animationState.set(false);
    }, 5000);

    const summaryText = giftLink ? 'gift' : 'collection';
    const detail = giftLink
      ? 'Share this gift link with a person who you collected for!'
      : 'Share this collection link with your colleagues and friends so they can add their kudos!';

    this.#messageService.clear();
    this.#messageService.add({
      severity: 'info',
      summary: `${capitalizeFirstLetter(summaryText)} link copied`,
      detail,
      life: 5000,
    });
  }
}
