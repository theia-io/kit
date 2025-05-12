import { AsyncPipe } from '@angular/common';
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
    <div class="flex gap-4 items-center">
      <h2 class="text-slate-900 font-bold text-3xl sm:text-4xl lg:text-5xl">
        <a [routerLink]="featuresKudoBoardUrl">
          <i class="pi pi-link font-semibold text-3xl"></i>
          Kudo boards ✨
        </a>
      </h2>

      <div
        sharedUserHint
        [enabled]="!(($hintHidden | async) === true)"
        text="No registration"
        nextLineText="Free"
        side="right"
        [extraIdent]="{ top: -10, right: 35 }"
      >
        <a
          [routerLink]="kudoBoardGenerateUrl"
          uiKitSmallTextTailwindClasses
          [klasses]="getStartedKlassOverwrite"
          class="inline-block px-10 py-5 bg-slate-700 rounded text-gray-900"
        >
          Create Kudo board
        </a>
      </div>
    </div>

    <p class="mt-2">
      Say Kudo to your colleagues, friends or family! Manage at ease
    </p>

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
