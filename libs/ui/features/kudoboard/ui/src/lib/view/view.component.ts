import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { findKudoBoardById, selectKudoBoards } from '@kitouch/data-kudoboard';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { KudoBoard } from '@kitouch/shared-models';
import { UiKitColorDisplayerComponent } from '@kitouch/ui-components';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest, filter, map } from 'rxjs';
import { isHexColor, isValidBucketUrl } from '../common';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-view',
  templateUrl: './view.component.html',
  imports: [
    //
    AsyncPipe,
    NgClass,
    //
    UiKitColorDisplayerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardViewComponent {
  id = model<KudoBoard['id']>();

  #store = inject(Store);
  #actions$ = inject(Actions);

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  kudoBoard$ = combineLatest([
    toObservable(this.id).pipe(filter(Boolean)),
    this.#store.pipe(select(selectKudoBoards)),
  ]).pipe(
    map(([id, kudoBoards]) => findKudoBoardById(id, kudoBoards)),
    filter(Boolean),
    takeUntilDestroyed()
  );

  isBucketUrl = isValidBucketUrl();
  isHexColor = isHexColor;
}
