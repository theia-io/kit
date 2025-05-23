import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { ENVIRONMENT, RouterEventsService } from '@kitouch/shared-infra';
import {
  UIKitSmallerHintTextUXDirective,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SharedStaticInfoComponent } from '../../static-info/static-info.component';

@Component({
  standalone: true,
  selector: 'shared-sub-navbar',
  templateUrl: './subnav.component.html',
  imports: [
    RouterModule,
    NgOptimizedImage,
    //
    TooltipModule,
    ButtonModule,
    //
    SharedStaticInfoComponent,
    UIKitSmallerHintTextUXDirective,
    UiKitTweetButtonComponent,
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

  createFarewellHandler() {
    this.#router.navigate([APP_PATH.Farewell, 'generate']);
  }

  createKudoBoardHandler() {
    this.#router.navigate([APP_PATH_ALLOW_ANONYMOUS.KudoBoard, 'generate']);
  }

  onGenerateHandler() {
    this.routerEventsService.saveUrlLatest(this.#router.url);
  }
}
