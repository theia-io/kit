import { NgOptimizedImage } from '@angular/common';
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
import {
  UiKitPicUploadableComponent,
  UiKitPicUploadableDirective,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { combineLatest, filter, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-view',
  templateUrl: './view.component.html',
  imports: [
    //
    NgOptimizedImage,
    //
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    //
    UIKitSmallerHintTextUXDirective,
    UiKitPicUploadableComponent,
    UiKitPicUploadableDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardViewComponent {
  id = model<KudoBoard['id']>();

  #store = inject(Store);
  #actions$ = inject(Actions);

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  #kudoBoard$ = combineLatest([
    toObservable(this.id).pipe(filter(Boolean)),
    this.#store.pipe(select(selectKudoBoards)),
  ]).pipe(
    map(([id, kudoBoards]) => findKudoBoardById(id, kudoBoards)),
    filter(Boolean),
    takeUntilDestroyed()
  );
}
