import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-kit-comp-account-tile',
  standalone: true,
  templateUrl: './account-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterModule, NgOptimizedImage],
})
export class AccountTileComponent {
  primaryText = input<string | undefined | null>();
  primarySecondaryText = input<string | undefined | null>(undefined);
  secondaryText = input<string | undefined>(undefined);
  picture = input<string | undefined>(undefined);
  link = input<string | undefined>(undefined);
  alt = input<string>();
}
