import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { User } from '@kitouch/shared/models';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'feat-follow-suggestions',
  templateUrl: './suggestions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    //
    //
  ],
})
export class FeatFollowSuggestionsComponent {
  user = input<User>();

  #store = inject(Store);

  constructor() {
    effect(() => {
      // this.#store.dispatch()
    });
  }
}
