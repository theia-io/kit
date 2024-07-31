import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

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
  generate = input.required<string>();

  logout = output<void>();
  help = output<void>();
}
