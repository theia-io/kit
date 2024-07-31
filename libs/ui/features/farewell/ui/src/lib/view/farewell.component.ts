import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FeatFarewellActions,
  findFarewellById,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import { Profile } from '@kitouch/shared-models';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilKeyChanged, filter, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-view',
  templateUrl: './farewell.component.html',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellComponent {
  farewellId = input.required<string>();

  profile = output<Profile>();

  #store = inject(Store);

  farewell$ = combineLatest([
    toObservable(this.farewellId),
    this.#store.select(selectFarewells),
  ]).pipe(
    map(([farewellId, farewells]) => findFarewellById(farewellId, farewells)),
    filter(Boolean)
  );

  constructor() {
    this.farewell$
      .pipe(
        map(({ profile }) => profile),
        distinctUntilKeyChanged('id'),
        takeUntilDestroyed()
      )
      .subscribe((profile) => this.profile.emit(profile));

    this.farewell$
      .pipe(distinctUntilKeyChanged('_id'), takeUntilDestroyed())
      .subscribe((farewell) =>
        this.#store.dispatch(
          FeatFarewellActions.putFarewell({
            farewell: { ...farewell, viewed: farewell.viewed + 1 },
          })
        )
      );
  }
}
