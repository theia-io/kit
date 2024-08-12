import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '../../constants';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  termsAndConditionsUrl = `/s/${APP_PATH_STATIC_PAGES.TermsAndConditions}`;
  privacyUrl = `/s/${APP_PATH_STATIC_PAGES.PrivacyPolicy}`;
  cookiesUrl = `/s/${APP_PATH_STATIC_PAGES.Cookie}`;

  year = new Date().getFullYear();
}
