import {
  AfterContentChecked,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';

type Side = 'top' | 'right' | 'bottom' | 'left';

const measureText = (() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return (textStr: string) => {
    const text = ctx?.measureText(textStr);
    return text?.width ?? 0;
  };
})();

@Directive({
  standalone: true,
  selector: '[sharedUserHint]',
})
export class SharedKitUserHintDirective implements AfterContentChecked {
  enabled = input<boolean>();
  text = input.required<string>();
  nextLineText = input<string>('');

  extraIdent = input<
    Partial<{ top: number; right: number; bottom: number; left: number }>
  >({});
  side = input<Side>('right');

  @HostBinding('class.relative') relativeClass = true;

  #hostRef = inject(ElementRef);
  #hostEl?: HTMLDivElement | HTMLParagraphElement;
  #hostStyles?: DOMRect;

  #supportedHintTmplTags = ['div', 'p', 'section'];

  appendedNode?: HTMLDivElement;

  constructor() {
    effect(() => {
      this.#generateUserHint({
        hostEl: this.#hostEl,
        enabled: this.enabled() ?? true,
        text: this.text(),
        side: this.side(),
      });
    });
  }

  ngAfterContentChecked(): void {
    const hostEl = this.#hostRef.nativeElement as HTMLElement,
      hostStyles = hostEl.getBoundingClientRect(),
      hostElTag = hostEl.tagName.toLowerCase();

    if (
      !this.#supportedHintTmplTags.some(
        (supportedHintTmplTag) => supportedHintTmplTag === hostElTag,
      )
    ) {
      console.error(
        '[SharedKitUserHintDirective] sharedUserHint cannot be applied on this tag and has no effect.',
      );
      return;
    }

    this.#hostEl = hostEl as HTMLDivElement | HTMLParagraphElement;
    this.#hostStyles = hostStyles;
  }

  #generateUserHint({
    hostEl,
    enabled,
    text,
    side,
  }: {
    hostEl?: HTMLDivElement | HTMLParagraphElement;
    enabled: boolean;
    text: string;
    side: Side;
  }) {
    if (!hostEl) {
      return;
    }

    if (this.appendedNode) {
      hostEl.removeChild(this.appendedNode);
    }

    if (!enabled) {
      return;
    }

    const wordsArr = text.split(' '),
      wordsArrLength = wordsArr.length;

    const hintEl = document.createElement('div');

    // @TODO @FIXME check that this makes sure that tailwind classes gets added (and not
    // because it is referenced somewhere else on the project).
    let prevX = 10,
      wordSetIdx = 0,
      lastX = 0;

    for (wordSetIdx; wordSetIdx < wordsArrLength; wordSetIdx++) {
      const textPartSection = wordsArr[wordSetIdx],
        curvature = 2 * Math.pow(wordSetIdx, 2);

      const pNativeElement = document.createElement('p');
      const slideX = prevX;
      lastX = slideX;
      let slideY = -1 * Math.log(curvature) * 3; //* (wordsArrLength - (wordsArrLength - wordSetIdx));

      if (side === 'bottom') {
        slideY = slideY * 2 * -1;
      }

      pNativeElement.style.transform = `translate(${slideX}px, ${slideY}px) rotate(-${Math.min(
        Math.log(curvature),
        90,
      )}deg)`;
      pNativeElement.innerHTML = textPartSection;

      hintEl.appendChild(pNativeElement);
      prevX += measureText(textPartSection) + 20;
    }

    const pNativeElement = document.createElement('p');
    pNativeElement.innerText = this.nextLineText() ?? '';
    pNativeElement.style.transform = `translate(${Math.max(
      lastX / 2,
      60,
    )}px, 25px)`;
    pNativeElement.style.width = `${measureText(this.nextLineText()) + 80}px`;

    hintEl.appendChild(pNativeElement);

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

    hostEl.appendChild(
      // make it Angular component and pass it through
      hintEl,
    );

    this.appendedNode = hintEl;
  }
}
