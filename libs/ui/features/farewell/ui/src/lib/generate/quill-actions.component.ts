import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  input,
  model,
  signal,
} from '@angular/core';
import Quill, { Bounds } from 'quill';
import { InputTextModule } from 'primeng/inputtext';
import { sign } from 'crypto';
import { FormControl, FormsModule, NgModel } from '@angular/forms';
import { throws } from 'assert';
import { safeUrl } from '@kitouch/utils';

const DEFAULT_LINK_PLACEHOLDER = 'Paste a link...';

@Component({
  standalone: true,
  selector: 'feat-farewell-quill-actions',
  templateUrl: './quill-actions.component.html',
  imports: [
    NgStyle,
    FormsModule,
    //
    //
    InputTextModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellQuillActionsComponent {
  quill = input.required<Quill>();
  bounds = input.required<Bounds | null>();
  show = model.required<boolean>();

  left = computed(() => {
    const domMeasuredHighlight = 156;
    const { left = 0, right = 0 } = this.bounds() ?? {};
    return left - domMeasuredHighlight / 2 + (right - left) / 2;
  });

  isLink = signal(false);
  linkVal = signal<string | null>(null);
  linkPlaceholder = signal(DEFAULT_LINK_PLACEHOLDER);

  @HostListener('keydown.enter')
  handleEnter() {
    this.linkHandler();
  }

  @HostListener('document:click')
  clickOutside() {
    if (this.isLink()) {
      this.isLink.set(false);
      return;
    }

    if (this.show()) {
      this.show.set(false);
      return;
    }
  }

  constructor() {
    effect(() => {
      console.log(this.bounds(), this.show());
    });
  }

  linkHandler() {
    const linkVal = this.linkVal();
    if (this.isLink()) {
      if (linkVal && safeUrl(linkVal)) {
        this.quill().format('link', linkVal);
        this.linkPlaceholder.set(DEFAULT_LINK_PLACEHOLDER);

        this.isLink.set(false);
        this.linkVal.set(null);
        this.show.set(false);
      } else {
        this.linkVal.set(null);
        this.linkPlaceholder.set('Try link e.g. https://...');
      }
    }
  }
}
