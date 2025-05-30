import { Injectable } from '@angular/core';
import { delay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  /** @TODO move from primeng menu component and remove this as well as all related code that triggers `triggerPrimengHighlight` */
  triggerPrimengHighlight$$ = new Subject<void>();

  triggerPrimengHighlight$ = this.triggerPrimengHighlight$$
    .asObservable()
    .pipe(delay(250));
}
