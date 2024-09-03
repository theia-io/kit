import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_PATH_STATIC_PAGES } from '../../constants';
import { SharedStaticInfoComponent } from '../static-info/static-info.component';

@Component({
  selector: 'shared-layout',
  standalone: true,
  imports: [SharedStaticInfoComponent],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  termsAndConditionsUrl = `/s/${APP_PATH_STATIC_PAGES.TermsAndConditions}`;
  privacyUrl = `/s/${APP_PATH_STATIC_PAGES.PrivacyPolicy}`;
  cookiesUrl = `/s/${APP_PATH_STATIC_PAGES.Cookie}`;

  year = new Date().getFullYear();
}
