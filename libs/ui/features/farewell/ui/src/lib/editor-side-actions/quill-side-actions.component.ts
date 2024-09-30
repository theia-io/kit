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

  // @HostListener('document:click')
  // clickOutside() {
  //   if (this.show()) {
  //     this.show.set(false);
  //     return;
  //   }
  // }

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
}
