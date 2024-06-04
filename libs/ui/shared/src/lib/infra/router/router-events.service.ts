import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterEventsService {
  latestBeforeRedirect$ = new BehaviorSubject<string>('');
}
