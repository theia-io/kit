import { Component, inject, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ENVIRONMENT } from '../../../infra';

@Component({
  standalone: true,
  selector: 'sub-navbar',
  templateUrl: './subnav.component.html',
  imports: [
    RouterModule,
    //
    TooltipModule,
  ],
})
export class SubnavComponent {
  farewellUrl = input.required<string>();

  logout = output<void>();
  help = output<void>();

  environment = inject(ENVIRONMENT);
}
