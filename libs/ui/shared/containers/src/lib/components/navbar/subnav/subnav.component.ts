import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import {
  UIKitSmallerHintTextUXDirective,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SharedStaticInfoComponent } from '../../static-info/static-info.component';
import { NavbarService } from '../navbar.service';

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
  offboardingUrl = input.required<string>();
  farewellUrl = input.required<string>();
  kudoBoardUrl = input.required<string>();
  introducingKitFarewell = input.required<string>();
  suggestionUrl = input.required<string>();

  logout = output<void>();

  environment = inject(ENVIRONMENT);
  navbarService = inject(NavbarService);
  #router = inject(Router);

  createOffboardingHandler() {
    this.navbarService.triggerPrimengHighlight$$.next();
    this.#router.navigate([APP_PATH_ALLOW_ANONYMOUS.Offboarding, 'generate']);
  }

  createFarewellHandler() {
    this.navbarService.triggerPrimengHighlight$$.next();
    this.#router.navigate([APP_PATH.Farewell, 'generate']);
  }

  createKudoBoardHandler() {
    this.navbarService.triggerPrimengHighlight$$.next();
    this.#router.navigate([APP_PATH_ALLOW_ANONYMOUS.KudoBoard, 'generate']);
  }
}
