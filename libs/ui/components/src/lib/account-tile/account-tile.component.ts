import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-comp-account-tile',
  standalone: true,
  templateUrl: './account-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class AccountTileComponent {
  @Input({ required: true })
  primaryText = '';

  @Input()
  primarySecondaryText: string | null = null;

  @Input()
  secondaryText: string | null = null;

  @Input()
  picture: string | null | undefined = null;
}
