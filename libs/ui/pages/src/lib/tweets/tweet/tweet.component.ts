import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'kit-page-tweet',
  template: `individual-tweet`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class PageTweetComponent {
  #activatedRouter = inject(ActivatedRoute);

  constructor() {
    console.log(this.#activatedRouter);
    this.#activatedRouter.params.subscribe(params => {
      console.log(params);
    });
  }
}
