import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { APP_PATH } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import {
  KlassOverwrite,
  UiCompGradientCardComponent,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';

import { DeviceService } from '@kitouch/shared-services';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import { PagesFeatureConnectedBenefitsComponent } from '../features/connected/connected-benefits.component';
import { PagesFeatureFarewellBenefitsComponent } from '../features/farewell/farewell-benefits.component';
import { PagesFeatureKudoBoardBenefitsComponent } from '../features/kudoboard/kudoboard-benefits.component';
import { ButtonModule } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  selector: 'kit-page-introduce-kit',
  styleUrls: ['./introduce-kit.component.scss'],
  templateUrl: './introduce-kit.component.html',
  imports: [
    NgOptimizedImage,
    RouterModule,
    //
    CardModule,
    TooltipModule,
    ButtonModule,
    //
    PagesFeatureConnectedBenefitsComponent,
    PagesFeatureFarewellBenefitsComponent,
    PagesFeatureKudoBoardBenefitsComponent,
    UIKitSmallerHintTextUXDirective,
    UiCompGradientCardComponent,
  ],
})
export class KitPagesIntroduceKitComponent {
  #auth0Service = inject(Auth0Service);
  loggedIn = toSignal(this.#auth0Service.loggedIn$);

  extraLarge$ = inject(DeviceService).innerWidth$.pipe(
    map((width) => width >= 1320)
  );

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-xl',
      color: 'text-white',
      // hoverColor: 'text-slate-700',
    },
  };

  homeUrl = `/${APP_PATH.Feed}`;

  otherInformation = {
    title: 'How, When, Who, Where?',
    cards: [
      {
        header: 'Format',
        text: 'Can be formal or informal depending on company culture.',
      },
      {
        header: 'Timing',
        text: 'A few days before the last day of work is generally appropriate.',
      },
      {
        header: 'Distribution',
        text: 'Can be sent to the whole company, a team, or individuals.',
      },
      {
        header: 'Social Media',
        text: 'Farewell messages can also be shared on platforms like LinkedIn.',
      },
    ],
    image: {
      title: 'Connected',
      url: '/introducing/shaking-hands.gif',
    },
  };

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
