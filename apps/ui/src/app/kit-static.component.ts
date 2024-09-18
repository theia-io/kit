import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { AuthService, SharedNavBarStaticComponent } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    RouterModule,
    //
    SharedNavBarStaticComponent,
  ],
  selector: 'app-kitouch-static',
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    min-height: 100vh; 
  }
  `,
  template: `<shared-navbar-static [fullBar]="!!(currentProfile$ | async)" />
    <div class="p-4 flex-grow flex flex-col">
      <router-outlet></router-outlet>
    </div>`,
})
export class KitStaticComponent {
  currentProfile$ = inject(Store).pipe(select(selectCurrentProfile));

  constructor() {
    inject(AuthService).refreshUser();
  }
}
