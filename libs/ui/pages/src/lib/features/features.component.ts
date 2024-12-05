import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  template: `
    <div class="flex flex-col w-full bg-secondary">
      <div class="container mx-auto"><router-outlet /></div>
    </div>
  `,
  styles: [
    `
      :host {
        flex-grow: 1;
        display: flex;
      }
    `,
  ],
  imports: [RouterModule],
})
export class PagesFeatureComponent {}
