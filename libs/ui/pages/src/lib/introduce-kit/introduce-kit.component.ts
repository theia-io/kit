import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  selector: 'kit-page-introduce-kit',
  styleUrls: ['./introduce-kit.component.scss'],
  templateUrl: './introduce-kit.component.html',
  imports: [
    NgTemplateOutlet,
    //
    //
    CardModule,
  ],
})
export class KitPagesIntroduceKitComponent {
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
