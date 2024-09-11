import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { SharedNavBarStaticComponent } from '@kitouch/ui-shared';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    //
    SharedNavBarStaticComponent,
  ],
  selector: 'app-kitouch-static',
  template: ` <div class="p-4">
    <shared-navbar-static [fullBar]="!!currentProfile()" />
    <router-outlet></router-outlet>
  </div>`,
})
export class KitStaticComponent {
  currentProfile = inject(Store).selectSignal(selectCurrentProfile);
}
