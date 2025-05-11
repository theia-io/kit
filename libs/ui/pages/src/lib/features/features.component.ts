import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  template: `
    <div class="flex flex-col w-full bg-secondary">
      <div class="container mx-auto py-4"><router-outlet /></div>
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
