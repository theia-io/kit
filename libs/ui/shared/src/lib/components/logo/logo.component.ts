import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { UXDynamicService } from '../../services';

@Component({
  standalone: true,
  selector: 'shared-logo',
  template: ` <a routerLink="/" class="flex items-center hover:cursor-pointer">
    <img
      class="inline-block h-10 w-auto rounded-full mt-2"
      [ngSrc]="uxDynamicService.logoPath()"
      alt="Kitouch logo"
      height="40"
      width="40"
    />

    <div class="relative">
      <p-tag
        severity="info"
        class="absolute -top-2 -right-12 rotate-12"
        value="Alpha"
        [rounded]="true"
      />

      <p class="ml-2">{{ logoText() }}</p>
    </div>
  </a>`,
  imports: [
    RouterModule,
    NgOptimizedImage,
    //
    TagModule,
  ],
})
export class UiLogoComponent {
  logoText = input('Keep in touch');

  uxDynamicService = inject(UXDynamicService);
}
