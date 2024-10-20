import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { selectFarewellFullViewById } from '@kitouch/feat-farewell-data';
import { Farewell } from '@kitouch/shared-models';
import { select, Store } from '@ngrx/store';
import { filter, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-actions',
  templateUrl: './farewell-actions.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellActionsComponent {
  farewellId = input.required<Farewell['id']>();

  #store = inject(Store);

  #farewellId$ = toObservable(this.farewellId).pipe(filter(Boolean));
  farewell$ = this.#farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellFullViewById(farewellId)))
    ),
    filter(Boolean)
  );
}
