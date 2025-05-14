import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  selector: 'kit-page-feature-connected-page-benefits',
  template: `
    <h2
      class="flex items-center gap-2 text-slate-800 font-semibold text-2xl lg:text-3xl dark:text-white"
    >
      <a [routerLink]="featuresConnectedUrl"> Connections. More </a>
      <img
        ngSrc="/material-icons/open_in_new.svg"
        alt="Open connections explore, link"
        width="30"
        height="300"
      />
    </h2>
    <p class="mt-1">Stay connected with your network and friends.</p>

    <div class="mt-8 flex flex-wrap flex-col md:flex-row gap-6">
      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <img
          src="logo/handshake.gif"
          alt="'Follow profile'"
          width="24"
          height="24"
        />

        <p class="m-0 text-lg font-semibold">Follow</p>

        <p class="m-0">Follow your network and friends.</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <img
          ngSrc="/material-icons/rss_feed.svg"
          alt="Feed"
          width="24"
          height="24"
        />

        <p class="m-0 text-lg font-semibold">Feed</p>

        <p class="m-0">Comment, re-tweet, like, share and bookmark.</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-send" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Tweet</p>

        <p class="m-0">
          Tweet your thoughts and more for followers. Share updates.
        </p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <img
          ngSrc="/material-icons/connect_without_contact.svg"
          alt="Interact"
          width="24"
          height="24"
        />

        <p class="m-0 text-lg font-semibold">Interact</p>

        <p class="m-0">Comment, re-tweet, like, share and bookmark.</p>
      </p-card>
    </div>
  `,
  imports: [
    RouterModule,
    NgOptimizedImage,
    //
    CardModule,
  ],
})
export class PagesFeatureConnectedBenefitsComponent {
  featuresConnectedUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesConnected}`;
}
