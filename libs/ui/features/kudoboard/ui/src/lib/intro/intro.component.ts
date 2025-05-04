import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedKitUserHintDirective } from '@kitouch/containers';
import {
  APP_PATH_ALLOW_ANONYMOUS,
  APP_PATH_STATIC_PAGES,
} from '@kitouch/shared-constants';
import { UiKitTweetButtonComponent } from '@kitouch/ui-components';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-intro',
  templateUrl: './intro.component.html',
  imports: [
    RouterModule,
    //
    ButtonModule,
    //
    UiKitTweetButtonComponent,
    SharedKitUserHintDirective,
  ],
})
export class FeatKudoBoardIntoComponent {
  withHint = input(false);

  featuresKudoBoardUrl = `/s/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesKudoboard}`;
  kudoBoardGenerateUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/generate`;

  watchVideo() {
    console.info('[UI FeatKudoBoardIntoComponent] Watch video');
  }
}
