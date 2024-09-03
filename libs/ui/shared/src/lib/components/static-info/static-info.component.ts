import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '../../constants';

@Component({
  selector: 'shared-static-info',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './static-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedStaticInfoComponent {
  termsAndConditionsUrl = `/s/${APP_PATH_STATIC_PAGES.TermsAndConditions}`;
  privacyUrl = `/s/${APP_PATH_STATIC_PAGES.PrivacyPolicy}`;
  cookiesUrl = `/s/${APP_PATH_STATIC_PAGES.Cookie}`;

  year = new Date().getFullYear();
}
