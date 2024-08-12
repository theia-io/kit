import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FeatFarewellActions,
  findFarewellById,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Farewell, Profile } from '@kitouch/shared-models';
import { DeviceService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { TooltipModule } from 'primeng/tooltip';
import {
  combineLatest,
  delay,
  distinctUntilKeyChanged,
  filter,
  map,
  of,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-view',
  templateUrl: './view.component.html',
  imports: [
    AsyncPipe,
    //
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellViewComponent {
  farewellId = input<string>();
  preview = input(false);

  farewell = output<Farewell>();
  profile = output<Profile>();

  #store = inject(Store);
  #destroyRef = inject(DestroyRef);

  device$ = inject(DeviceService).device$;

  farewell$ = combineLatest([
    toObservable(this.farewellId).pipe(filter(Boolean)),
    this.#store.select(selectFarewells),
  ]).pipe(
    map(([farewellId, farewells]) => findFarewellById(farewellId, farewells)),
    filter(Boolean),
    shareReplay()
  );

  constructor() {
    this.farewell$
      .pipe(takeUntilDestroyed(), distinctUntilKeyChanged('id'))
      .subscribe((farewell) => this.farewell.emit(farewell));

    this.farewell$
      .pipe(
        takeUntilDestroyed(),
        map(({ profile }) => profile),
        distinctUntilKeyChanged('id')
      )
      .subscribe((profile) => this.profile.emit(profile));

    of(null)
      .pipe(
        takeUntilDestroyed(),
        delay(2500),
        withLatestFrom(
          this.farewell$,
          this.#store.pipe(select(selectCurrentProfile))
        )
      )
      .subscribe(([_, farewell, currentProfile]) =>
        this.#visitorActions(farewell, currentProfile)
      );
  }

  #visitorActions(farewell: Farewell, currentProfile: Profile | undefined) {
    if (
      this.preview() &&
      currentProfile &&
      farewell.profile.id === currentProfile.id
    ) {
      // Only when it is current profile and its farewell we consider
      // such users real previewers
      return;
    }

    this.farewell$
      .pipe(takeUntilDestroyed(this.#destroyRef), distinctUntilKeyChanged('id'))
      .subscribe((farewell) =>
        this.#store.dispatch(
          FeatFarewellActions.putFarewell({
            farewell: { ...farewell, viewed: farewell.viewed + 1 },
          })
        )
      );
  }
}
