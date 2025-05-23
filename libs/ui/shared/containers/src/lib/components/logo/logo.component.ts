import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Device, UXDynamicService } from '@kitouch/shared-services';

@Component({
  standalone: true,
  selector: 'shared-logo',
  template: `<a routerLink="/" class="flex items-center hover:cursor-pointer">
    <img
      class="inline-block h-10 w-auto rounded-full"
      [ngSrc]="uxDynamicService.logoPath()"
      referrerpolicy="no-referrer"
      alt="Kitouch logo"
      height="40"
      width="40"
    />
  </a>`,
  imports: [RouterModule, NgOptimizedImage],
})
export class UiLogoComponent {
  uxDynamicService = inject(UXDynamicService);

  devices = Device;
}
