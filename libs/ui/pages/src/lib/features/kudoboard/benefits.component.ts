import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedKitUserHintDirective } from '@kitouch/containers';
import {
  APP_PATH_ALLOW_ANONYMOUS,
  APP_PATH_STATIC_PAGES,
} from '@kitouch/shared-constants';
import { DeviceService } from '@kitouch/shared-infra';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { CardModule } from 'primeng/card';
import { startWith } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-feature-kudoboard-page-benefits',
  template: `
    <h2
      class="flex items-center gap-2 text-slate-800 font-semibold text-2xl lg:text-3xl dark:text-white"
    >
      <a [routerLink]="featuresKudoBoardUrl"> Kudo boards. More </a>
      <img
        ngSrc="/material-icons/open_in_new.svg"
        alt="Open kudo boards explore, link"
        width="30"
        height="300"
      />
    </h2>

    <p class="mt-1">
      Say Kudo to your colleagues, friends or family! Manage at ease
    </p>

    <div class="my-4 w-100 flex flex-col gap-1 items-center lg:items-start">
      <a
        [routerLink]="kudoBoardGenerateUrl"
        uiKitSmallTextTailwindClasses
        [klasses]="getStartedKlassOverwrite"
        class="inline-block px-10 py-5 bg-slate-700 rounded text-gray-900"
      >
        Create Kudo board. Yours
      </a>
      <p class="text-gray-500 text-sm font-semibold">
        Create kudo board yourself.
        <br />
        Even anonymously.
      </p>
    </div>

    <div class="mt-8 flex flex-wrap flex-col md:flex-row gap-6">
      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-users" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Collaborate</p>

        <p class="m-0">Add comments from everyone.</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-bolt" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Flexible</p>

        <p class="m-0">Changed your mind? Update or delete at your wish</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-wave-pulse" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Powerful</p>

        <p class="m-0">Publish, keep drafts</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-wrench" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">You are in control</p>

        <p class="m-0">Kudoboard owners can delete any kudos</p>
      </p-card>

      <p-card styleClass="h-40 w-72 hover:shadow-xl" header="">
        <i class="pi pi-search" style="font-size: 1.5rem"></i>

        <p class="m-0 text-lg font-semibold">Analyze</p>
      </p-card>
    </div>
  `,
  imports: [
    RouterModule,
    AsyncPipe,
    NgOptimizedImage,
    //
    CardModule,
    //
    UIKitSmallerHintTextUXDirective,
    SharedKitUserHintDirective,
  ],
})
export class PagesFeatureKudoBoardBenefitsComponent {
  $hintHidden = inject(DeviceService).isMobile$.pipe(startWith(true));

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

  featuresKudoBoardUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesKudoboard}`;
  kudoBoardGenerateUrl = `/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/generate`;
}
