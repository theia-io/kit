import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';
import { TooltipModule } from 'primeng/tooltip';
import { ENVIRONMENT, RouterEventsService } from '../../../infra';
import { SharedStaticInfoComponent } from '../../static-info/static-info.component';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'shared-sub-navbar',
  templateUrl: './subnav.component.html',
  imports: [
    RouterModule,
    //
    TooltipModule,
    ButtonModule,
    //
    SharedStaticInfoComponent,
    UIKitSmallerHintTextUXDirective,
  ],
})
export class SubnavComponent {
  farewellUrl = input.required<string>();
  kudoBoardUrl = input.required<string>();
  introducingKitFarewell = input.required<string>();
  suggestionUrl = input.required<string>();

  logout = output<void>();

  environment = inject(ENVIRONMENT);
  routerEventsService = inject(RouterEventsService);
  #router = inject(Router);

  onGenerateHandler() {
    this.routerEventsService.saveUrlLatest(this.#router.url);
  }
}
