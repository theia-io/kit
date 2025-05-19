import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH } from '@kitouch/shared-constants';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';

@Component({
  standalone: true,
  selector: 'shared-feature-intro',
  templateUrl: './feature-intro.component.html',
  imports: [
    RouterModule,
    //
    UIKitSmallerHintTextUXDirective,
  ],
})
export class SharedFeatureIntroComponent {
  name = input.required<string>();
  title = input.required<string>();
  isLoggedIn = input.required<boolean>();

  getStarted = output<void>();

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

  homeUrl = `/${APP_PATH.Feed}`;
}
