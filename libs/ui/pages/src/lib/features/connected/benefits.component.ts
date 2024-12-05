import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  selector: 'kit-page-feature-connected-page-benefits',
  template: `
    <h2 class="text-slate-900 font-bold text-3xl sm:text-4xl lg:text-5xl">
      Connected @if(showLink()) {
      <a
        [routerLink]="featuresConnectedUrl"
        routerLinkActive="bg-slate-200 rounded text-gray-900"
        uiKitSmallTextTailwindClasses
        class="px-4 py-2"
      >
        More...
      </a>
      }
    </h2>
    <p class="mt-2">Stay connected with your colleagues.</p>

    <div class="mt-8 flex flex-wrap flex-col md:flex-row gap-6">
      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <img
          src="logo/handshake.gif"
          alt="'Follow profile'"
          width="24"
          height="24"
        />

        <p class="m-0 text-lg font-semibold">Follow</p>

        <p class="m-0">Follow people you know.</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-send" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Tweet</p>

        <p class="m-0">
          Tweet your thoughts, updates and more with KIT platform.
        </p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-comments" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Interact</p>

        <p class="m-0">
          Leave comments, like and bookmark tweets across the platform.
        </p>
      </p-card>
    </div>
  `,
  imports: [
    RouterModule,
    //
    CardModule,
    //
    UIKitSmallerHintTextUXDirective,
  ],
})
export class PagesFeatureConnectedBenefitsComponent {
  showLink = input(false);

  featuresConnectedUrl = `/s/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesConnected}`;
}
