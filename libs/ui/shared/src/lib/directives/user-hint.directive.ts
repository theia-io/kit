import {
  AfterContentChecked,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnInit,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[userHint]',
})
export class UserHintDirective implements AfterContentChecked {
  text = input.required<string>();
  side = input<'top' | 'right' | 'bottom' | 'left'>('right');
  size = input(8);

  @HostBinding('class.relative') relativeClass = true;

  #hostRef = inject(ElementRef);
  #hostEl?: HTMLDivElement | HTMLParagraphElement;
  #hostStyles?: DOMRect;

  #supportedHintTmplTags = ['div', 'p', 'section'];

  constructor() {
    effect(() => {
      console.log('calling generateUserHint!');
      this.#generateUserHint();
    });
  }

  ngAfterContentChecked(): void {
    console.log(this.#hostRef);

    const hostEl = this.#hostRef.nativeElement as HTMLElement,
      hostStyles = hostEl.getBoundingClientRect(),
      hostElTag = hostEl.tagName.toLowerCase();

    if (
      !this.#supportedHintTmplTags.some(
        (supportedHintTmplTag) => supportedHintTmplTag === hostElTag
      )
    ) {
      console.error(
        '[UserHintDirective] userHint cannot be applied on this tag and has no effect.'
      );
      return;
    }

    this.#hostEl = hostEl as HTMLDivElement | HTMLParagraphElement;
    this.#hostStyles = hostStyles;
  }

  #generateUserHint() {
    if (!this.#hostEl) {
      console.error('[UserHintDirective] no host element found!');
      return;
    }

    const text = this.text(),
      wordsArr = text.split(' '),
      wordsArrLength = wordsArr.length;

    const hintEl = document.createElement('div');

    // @TODO @FIXME check that this makes sure that tailwind classes gets added (and not
    // because it is referenced somewhere else on the project).
    let prevX = this.side() === 'right' ? wordsArr[0].length : 50,
      wordSetIdx = 0;
    for (wordSetIdx; wordSetIdx < wordsArrLength; wordSetIdx++) {
      const textPartSection = wordsArr[wordSetIdx],
        textPartSectionLength = textPartSection.length;

      const charEl = document.createElement('p');
      const slideX = prevX;
      let slideY = -1 * (wordSetIdx * 10 + 10); //* (wordsArrLength - (wordsArrLength - wordSetIdx));
      if (this.side() === 'bottom') {
        slideY = slideY * 2 * -1;
      }

      console.log(slideX, slideY);

      charEl.style.transform = `translate(${slideX}px, ${slideY}px) rotate(-${Math.min(
        Math.sqrt(textPartSectionLength) + Math.sqrt(wordSetIdx) * 15,
        90
      )}deg)`;
      charEl.innerHTML = textPartSection;

      hintEl.appendChild(charEl);
      prevX += textPartSectionLength * this.size();
    }

    const arrowSize = 40;
    const arrowEl = document.createElement('img');
    arrowEl.src = `arrow/arrow-${this.side()}.svg`;
    arrowEl.style.height = `${arrowSize}px`;
    arrowEl.style.marginTop = `${arrowSize / 2}px`;
    arrowEl.style.transform = 'rotate3d(1, 1, 1, 45deg)';

    hintEl.appendChild(arrowEl);

    console.log('this.#hostStyles', this.#hostStyles);

    switch (this.side()) {
      case 'bottom':
        hintEl.style.left = '10px';
        hintEl.style.bottom = `${-50}px`;
        break;
      case 'right':
      default:
        hintEl.style.top = `${Math.floor(this.#hostStyles?.height ?? 0) / 4}px`;
        hintEl.style.right = `-${arrowSize}px`;

        break;
    }

    hintEl.classList.add('user-hint');

    this.#hostEl.appendChild(
      // make it Angular component and pass it through
      hintEl
    );
  }
}
