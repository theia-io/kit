import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'account-tile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './account-tile.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTileComponent {
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
