import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { safeUrl } from '@kitouch/utils';
import { InputTextModule } from 'primeng/inputtext';
import Quill, { Bounds } from 'quill';

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
