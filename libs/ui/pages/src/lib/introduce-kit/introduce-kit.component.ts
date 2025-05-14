import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH } from '@kitouch/shared-constants';
import { Auth0Service, DeviceService } from '@kitouch/shared-infra';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';

import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import { PagesFeatureConnectedBenefitsComponent } from '../features/connected/benefits.component';
import { PagesFeatureFarewellBenefitsComponent } from '../features/farewell/benefits.component';
import { PagesFeatureKudoBoardBenefitsComponent } from '../features/kudoboard/benefits.component';

@Component({
  standalone: true,
  selector: 'kit-page-introduce-kit',
  styleUrls: ['./introduce-kit.component.scss'],
  templateUrl: './introduce-kit.component.html',
  imports: [
    RouterModule,
    //
    CardModule,
    TooltipModule,
    //
    PagesFeatureConnectedBenefitsComponent,
    PagesFeatureFarewellBenefitsComponent,
    PagesFeatureKudoBoardBenefitsComponent,
    UIKitSmallerHintTextUXDirective,
  ],
})
export class KitPagesIntroduceKitComponent {
  #auth0Service = inject(Auth0Service);

  extraLarge$ = inject(DeviceService).innerWidth$.pipe(
    map((width) => width >= 1320)
  );

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
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
