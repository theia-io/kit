import {
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
export class UserHintDirective implements OnInit {
  text = input.required<string>();
  side = input<'top' | 'right' | 'bottom' | 'left'>('right');
  size = input(8);

  @HostBinding('class.relative') relativeClass = true;

  #hostRef = inject(ElementRef);

  #supportedHintTmplTags = ['div', 'p', 'section'];

  constructor() {
    effect(() => {
      console.log(this.#generateUserHint());
    });
  }

  ngOnInit(): void {
    console.log(this.#hostRef);

    const hostEl = this.#hostRef.nativeElement as HTMLElement,
      hostElHeight = hostEl.offsetHeight,
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
    // const hostParEl = hostEl.parentNode;

    const text = this.text(),
      wordsArr = text.split(' '),
      wordsArrLength = wordsArr.length;

    console.log(text, wordsArr, wordsArrLength);

    const hintEl = document.createElement('div');

    // @TODO @FIXME check that this makes sure that tailwind classes gets added (and not
    // because it is referenced somewhere else on the project).
    let prevX = wordsArr[0].length,
      wordSetIdx = 0;
    for (wordSetIdx; wordSetIdx < wordsArrLength; wordSetIdx++) {
      const textPartSection = wordsArr[wordSetIdx],
        textPartSectionLength = textPartSection.length;
      console.log(textPartSection, textPartSectionLength);

      const charEl = document.createElement('p');
      const slideX = prevX;
      const slideY = wordSetIdx * 10 + 10; //* (wordsArrLength - (wordsArrLength - wordSetIdx));

      console.log(slideX, slideY);

      charEl.style.transform = `translate(${slideX}px, -${slideY}px) rotate(-${Math.min(
        Math.sqrt(textPartSectionLength) + Math.sqrt(wordSetIdx) * 15,
        90
      )}deg)`;
      charEl.innerHTML = textPartSection;

      hintEl.appendChild(charEl);
      prevX += textPartSectionLength * this.size();
    }

    const arrowSize = 40;
    const arrowEl = document.createElement('img');
    arrowEl.src = 'arrow/arrow-right.svg';
    arrowEl.style.height = `${arrowSize}px`;
    arrowEl.style.marginTop = `${arrowSize / 2}px`;
    arrowEl.style.transform = 'rotate3d(1, 1, 1, 45deg)';

    hintEl.appendChild(arrowEl);

    console.log('hostElHeight', hostElHeight);
    hintEl.style.top = `${Math.floor(hostElHeight / 4)}px`;
    hintEl.style.right = `-${arrowSize}px`;
    hintEl.classList.add('user-hint');

    hostEl.appendChild(
      // make it Angular component and pass it through
      hintEl
    );
  }

  #generateUserHint() {}
}
