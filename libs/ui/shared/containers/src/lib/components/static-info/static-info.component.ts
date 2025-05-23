import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';

@Component({
  selector: 'shared-static-info',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './static-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedStaticInfoComponent {
  slim = input(false);

  termsAndConditionsUrl = `/${APP_PATH_STATIC_PAGES.TermsAndConditions}`;
  privacyUrl = `/${APP_PATH_STATIC_PAGES.PrivacyPolicy}`;
  cookiesUrl = `/${APP_PATH_STATIC_PAGES.Cookie}`;

  year = new Date().getFullYear();
}
