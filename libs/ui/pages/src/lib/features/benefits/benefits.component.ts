import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'kit-page-feature-benefits',
  templateUrl: 'benefits.component.html',
  imports: [RouterModule, NgOptimizedImage],
})
export class PagesFeatureBenefitsComponent {
  header = input.required<string>();
  isAtFeaturePage = input(false);
  featuresPageUrl = input.required<string>();
  description = input.required<string>();
}
