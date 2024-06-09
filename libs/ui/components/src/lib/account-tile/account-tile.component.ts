import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'account-tile',
  standalone: true,
  templateUrl: './account-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
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

  @Input()
  link: string | null = null;
}
