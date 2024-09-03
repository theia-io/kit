import { Component, inject, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';
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
    //
    UIKitSmallerHintTextUXDirective,
  ],
})
export class SubnavComponent {
  farewellUrl = input.required<string>();
  introducingKitFarewell = input.required<string>();

  logout = output<void>();
  help = output<void>();

  environment = inject(ENVIRONMENT);
}
