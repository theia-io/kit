import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthorizedFeatureDirective,
  SharedKitUserHintDirective,
} from '@kitouch/containers';
import { APP_PATH, APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { UiKitTweetButtonComponent } from '@kitouch/ui-components';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'feat-farewell-intro',
  templateUrl: './intro.component.html',
  imports: [
    RouterModule,
    //
    ButtonModule,
    UiKitTweetButtonComponent,
    AuthorizedFeatureDirective,
    SharedKitUserHintDirective,
    //
  ],
})
export class FeatFarewellIntoComponent {
  withHint = input(false);

  featuresFarewellUrl = `/s/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesFarewell}`;
  farewellGenerate = `/${APP_PATH.Farewell}/generate`;

  watchVideo() {
    console.log('Watch video');
  }
}
