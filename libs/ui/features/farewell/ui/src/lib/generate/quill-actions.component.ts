import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  input,
  model,
} from '@angular/core';
import Quill, { Bounds } from 'quill';

@Component({
  standalone: true,
  selector: 'feat-farewell-quill-actions',
  templateUrl: './quill-actions.component.html',
  imports: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellQuillActionsComponent {
  quill = input.required<Quill>();
  bounds = input.required<Bounds | null>();
  show = model.required<boolean>();

  @HostListener('document:click')
  clickOutside() {
    if (this.show()) {
      this.show.set(false);
    }
  }

  constructor() {
    effect(() => {
      console.log(this.bounds(), this.show());
    });
  }
}
