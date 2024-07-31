import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  findFarewellById,
  selectFarewells
} from '@kitouch/feat-farewell-data';
import { Store } from '@ngrx/store';
import { combineLatest, map, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-view',
  templateUrl: './farewell.component.html',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellComponent {
  farewellId = input.required<string>();

  #store = inject(Store);

  farewell$ = combineLatest([
    toObservable(this.farewellId),
    this.#store.select(selectFarewells),
  ]).pipe(
    tap((v) => console.log('farewell0', v)),
    map(([farewellId, farewells]) => findFarewellById(farewellId, farewells)),
    tap((v) => console.log('farewell', v))
  );
}
