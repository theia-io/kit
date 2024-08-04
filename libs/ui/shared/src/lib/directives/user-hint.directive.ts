import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[userHint]',
})
export class UserHintDirective implements OnInit {
  #hostRef = inject(ElementRef);

  #supportedHintTmplTags = ['div', 'p', 'section'];

  ngOnInit(): void {
    console.log(this.#hostRef);

    const hostEl = this.#hostRef.nativeElement as HTMLElement;
    const hostElTag = hostEl.tagName.toLowerCase();
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

    const hintEl = document.createElement('div');
    hintEl.classList.add('absolute');
    hintEl.innerHTML = 'This is hint test';

    // if we would support inserting after like router outlet does
    // hostParEl?.insertBefore(
    //     hintEl,
    //     hostEl
    // );

    hostEl.appendChild(
      // make it Angular component and pass it through
      hintEl
    );
  }
}
