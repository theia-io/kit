import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedNavBarStaticComponent } from '@kitouch/ui-shared';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    //
    SharedNavBarStaticComponent,
  ],
  selector: 'app-kitouch-static',
  template: ` <div class="p-4">
    <shared-navbar-static />
    <router-outlet></router-outlet>
  </div>`,
})
export class KitStaticComponent {}
