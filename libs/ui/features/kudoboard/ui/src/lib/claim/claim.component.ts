import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { selectKudoBoardById } from '@kitouch/data-kudoboard';

import { select, Store } from '@ngrx/store';
import { TooltipModule } from 'primeng/tooltip';
import { switchMap } from 'rxjs';

@Component({
  selector: 'feat-kudoboard-claim',
  templateUrl: './claim.component.html',
  imports: [
    AsyncPipe,
    //
    TooltipModule,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardClaimComponent {
  kudoboardId = input.required<string>();

  #store = inject(Store);
  kudoboardId$ = toObservable(this.kudoboardId);

  kudoboard$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardById(kudoboardId))),
    ),
  );
}
