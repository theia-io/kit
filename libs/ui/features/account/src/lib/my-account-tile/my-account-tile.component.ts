import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
export class MyAccountTileComponent {
  @Input({required: true})
  primaryText = '';

  @Input()
  primarySecondaryText: string | null = null;

  @Input()
  secondaryText: string | null = null;

  @Input()
  picture: string | null = null;

  @Input()
  link: string | null = null;
}
