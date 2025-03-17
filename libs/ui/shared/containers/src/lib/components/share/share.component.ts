import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'shared-copy-clipboard',
  templateUrl: './share.component.html',
  imports: [
    //
    ButtonModule,
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedCopyClipboardComponent {
  url = input.required<string>();

  linkCopied = signal(false);

  copyToClipBoard() {
    navigator.clipboard.writeText(this.url());

    this.linkCopied.set(true);
    // TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.linkCopied.set(false);
    }, 5000);
  }
}
