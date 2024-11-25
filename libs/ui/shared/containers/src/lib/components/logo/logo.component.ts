import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Device, DeviceService } from '@kitouch/shared-infra';
import { UXDynamicService } from '@kitouch/shared-services';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'shared-logo',
  template: `<a routerLink="/" class="flex items-center hover:cursor-pointer">
    <img
      class="inline-block h-10 w-auto rounded-full mt-2"
      [ngSrc]="uxDynamicService.logoPath()"
      referrerpolicy="no-referrer"
      alt="Kitouch logo"
      height="40"
      width="40"
    />

    <div class="relative">
      <p-tag
        severity="info"
        class="absolute -top-2 -right-12 rotate-12"
        value="Beta"
        [rounded]="true"
      />

      @if((deviceService.device$ | async) !== devices.Mobile) {
      <p class="ml-2">{{ logoText() }}</p>
      }
    </div>
  </a>`,
  imports: [
    AsyncPipe,
    RouterModule,
    NgOptimizedImage,
    //
    TagModule,
  ],
})
export class UiLogoComponent {
  logoText = input('Keep in touch');

  uxDynamicService = inject(UXDynamicService);
  deviceService = inject(DeviceService);

  devices = Device;
}
