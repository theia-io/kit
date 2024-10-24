import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { APP_PATH, DeviceService } from '@kitouch/ui-shared';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-introduce-kit',
  styleUrls: ['./introduce-kit.component.scss'],
  templateUrl: './introduce-kit.component.html',
  imports: [
    AsyncPipe,
    RouterModule,
    NgClass,
    NgTemplateOutlet,
    //
    CardModule,
    TooltipModule,
    //
    UIKitSmallerHintTextUXDirective,
  ],
})
export class KitPagesIntroduceKitComponent {
  extraLarge$ = inject(DeviceService).innerWidth$.pipe(
    map((width) => width >= 1320)
  );

  homeUrl = `/${APP_PATH.Home}`;

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

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
}
