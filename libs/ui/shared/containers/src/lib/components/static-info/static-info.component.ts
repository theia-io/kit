import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';

@Component({
  selector: 'shared-static-info',
  imports: [RouterModule, NgClass],
  templateUrl: './static-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedStaticInfoComponent {
  slim = input(false);

  termsAndConditionsUrl = `/s/${APP_PATH_STATIC_PAGES.TermsAndConditions}`;
  privacyUrl = `/s/${APP_PATH_STATIC_PAGES.PrivacyPolicy}`;
  cookiesUrl = `/s/${APP_PATH_STATIC_PAGES.Cookie}`;

  year = new Date().getFullYear();
}
