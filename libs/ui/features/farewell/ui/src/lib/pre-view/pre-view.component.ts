import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FarewellFullView,
  selectFarewellFullViewById,
} from '@kitouch/feat-farewell-data';
import { Profile } from '@kitouch/shared-models';
import { DeviceService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { distinctUntilKeyChanged, filter, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-preview',
  templateUrl: './pre-view.component.html',
  styleUrls: ['./pre-view.component.scss'],
  imports: [
    AsyncPipe,
    //
    ImageModule,
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellPreViewComponent {
  farewellId = input<string>();
  preview = input(false);

  farewell = output<FarewellFullView>();
  profile = output<Profile>();

  #store = inject(Store);
  sanitizer = inject(DomSanitizer);
  device$ = inject(DeviceService).device$;

  #farewellId$ = toObservable(this.farewellId).pipe(filter(Boolean));

  farewell$ = this.#farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellFullViewById(farewellId)))
    ),
    filter(Boolean)
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
  }
}
