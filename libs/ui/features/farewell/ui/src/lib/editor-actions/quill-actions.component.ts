import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { safeUrl } from '@kitouch/utils';
import { InputTextModule } from 'primeng/inputtext';
import Quill, { Bounds } from 'quill';

const DEFAULT_LINK_PLACEHOLDER = 'Paste a link...';

@Component({
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

  @ViewChild('linkEl', { static: false })
  set linkEl(linkEl: ElementRef) {
    const linkInput: HTMLInputElement = linkEl?.nativeElement;
    // when linkInput is shown
    if (linkInput) {
      linkInput.focus();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  handleEnter(event: Event) {
    this.linkHandler(event);
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

  onLinkClickHandler(event: Event) {
    event.stopPropagation();
    this.isLink.set(true);
  }

  linkHandler(event: Event) {
    event.stopPropagation();
    event.preventDefault();

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
