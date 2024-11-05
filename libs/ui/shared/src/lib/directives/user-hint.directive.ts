import {
  AfterContentChecked,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';

const measureText = (() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return (textStr: string) => {
    const text = ctx?.measureText(textStr);
    return text?.width;
  };
})();

@Directive({
  standalone: true,
  selector: '[sharedUserHint]',
})
export class SharedKitUserHintDirective implements AfterContentChecked {
  text = input.required<string>();
  extraIdent = input<
    Partial<{ top: number; right: number; bottom: number; left: number }>
  >({});
  side = input<'top' | 'right' | 'bottom' | 'left'>('right');

  @HostBinding('class.relative') relativeClass = true;

  #hostRef = inject(ElementRef);
  #hostEl?: HTMLDivElement | HTMLParagraphElement;
  #hostStyles?: DOMRect;

  #supportedHintTmplTags = ['div', 'p', 'section'];

  constructor() {
    effect(() => {
      this.#generateUserHint();
    });
  }

  ngAfterContentChecked(): void {
    const hostEl = this.#hostRef.nativeElement as HTMLElement,
      hostStyles = hostEl.getBoundingClientRect(),
      hostElTag = hostEl.tagName.toLowerCase();

    if (
      !this.#supportedHintTmplTags.some(
        (supportedHintTmplTag) => supportedHintTmplTag === hostElTag
      )
    ) {
      console.error(
        '[SharedKitUserHintDirective] sharedUserHint cannot be applied on this tag and has no effect.'
      );
      return;
    }

    this.#hostEl = hostEl as HTMLDivElement | HTMLParagraphElement;
    this.#hostStyles = hostStyles;
  }

  #generateUserHint() {
    if (!this.#hostEl) {
      console.error('[SharedKitUserHintDirective] no host element found!');
      return;
    }

    const text = this.text(),
      wordsArr = text.split(' '),
      wordsArrLength = wordsArr.length;

    const hintEl = document.createElement('div');

    // @TODO @FIXME check that this makes sure that tailwind classes gets added (and not
    // because it is referenced somewhere else on the project).
    let prevX = 10,
      wordSetIdx = 0;

    for (wordSetIdx; wordSetIdx < wordsArrLength; wordSetIdx++) {
      const textPartSection = wordsArr[wordSetIdx],
        textPartSectionLength = textPartSection.length;

      const pNativeElement = document.createElement('p');
      const slideX = prevX;
      let slideY = -1 * (wordSetIdx * 10 + 10); //* (wordsArrLength - (wordsArrLength - wordSetIdx));
      if (this.side() === 'bottom') {
        slideY = slideY * 2 * -1;
      }

      pNativeElement.style.transform = `translate(${slideX}px, ${slideY}px) rotate(-${Math.min(
        Math.sqrt(textPartSectionLength) + Math.sqrt(wordSetIdx) * 15,
        90
      )}deg)`;
      pNativeElement.innerHTML = textPartSection;

      hintEl.appendChild(pNativeElement);
      prevX += (measureText(textPartSection) ?? 0) + 15;
    }

    const arrowSize = 40;
    const arrowEl = document.createElement('img');
    arrowEl.src = `arrow/arrow-${this.side()}.svg`;
    arrowEl.style.height = `${arrowSize}px`;
    arrowEl.style.marginTop = `${arrowSize / 2}px`;
    arrowEl.style.transform = 'rotate3d(1, 1, 1, 45deg)';

    hintEl.appendChild(arrowEl);

    const { top = 0, right = 0, bottom = 0, left = 0 } = this.extraIdent();

    switch (this.side()) {
      case 'bottom':
        hintEl.style.left = `${left + 10}px`;
        hintEl.style.bottom = `-${50 + bottom}px`;
        break;
      case 'left':
        hintEl.style.top = `${
          top + Math.floor(this.#hostStyles?.height ?? 0) / 4
        }px`;
        hintEl.style.left = `-${left + arrowSize}px`;
        break;
      case 'right':
      default:
        hintEl.style.top = `${
          top + Math.floor(this.#hostStyles?.height ?? 0) / 4
        }px`;
        hintEl.style.right = `-${right + arrowSize}px`;

        break;
    }

    hintEl.classList.add('user-hint');

    this.#hostEl.appendChild(
      // make it Angular component and pass it through
      hintEl
    );
  }
}
