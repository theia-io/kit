import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Quill, { Bounds } from 'quill';

@Component({
  standalone: true,
  selector: 'feat-farewell-quill-side-actions',
  templateUrl: './quill-side-actions.component.html',
  imports: [
    NgStyle,
    FormsModule,
    //
    //
    ToggleButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellQuillSideActionsComponent {
  quill = input.required<Quill>();
  bounds = input.required<Bounds | null>();
  show = model.required<boolean>();

  opened = signal(false);

  constructor() {
    effect(
      () => {
        console.log('SIDE ACTIONS', this.show(), this.bounds());

        if (!this.show()) {
          this.opened.set(false);
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  dividerHandler() {
    const quill = this.quill();
    const range = quill.getSelection(true);

    quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
    quill.insertText(range.index + 1, '\n', Quill.sources.USER);

    quill.setSelection(range.index + 2, Quill.sources.SILENT);

    this.show.set(false);
  }
}
