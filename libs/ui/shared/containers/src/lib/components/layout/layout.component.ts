import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from './layout.service';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';

@Component({
  selector: 'shared-layout',
  standalone: true,
  imports: [NgClass, AsyncPipe],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  layoutService = inject(LayoutService);

  termsAndConditionsUrl = `/s/${APP_PATH_STATIC_PAGES.TermsAndConditions}`;
  privacyUrl = `/s/${APP_PATH_STATIC_PAGES.PrivacyPolicy}`;
  cookiesUrl = `/s/${APP_PATH_STATIC_PAGES.Cookie}`;

  year = new Date().getFullYear();
}