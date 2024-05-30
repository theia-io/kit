import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'my-account-tile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './my-account-tile.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAccountTileComponent {}
