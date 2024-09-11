import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_PATH_STATIC_PAGES } from '../../constants';
import { SharedStaticInfoComponent } from '../static-info/static-info.component';
import { LayoutService } from './layout.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'shared-layout',
  standalone: true,
  imports: [NgClass, SharedStaticInfoComponent],
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
