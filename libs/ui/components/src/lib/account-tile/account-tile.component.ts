import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * TODO find usage of this component and when profile is not resolved add placeholder and make that such use-cases when profiles are not resolved are triggered to be resolved. Add for similar components
 */
@Component({
  selector: 'ui-kit-comp-account-tile',
  templateUrl: './account-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgTemplateOutlet, RouterModule],
})
export class AccountTileComponent {
  primaryText = input<string | undefined | null>();
  primarySecondaryText = input<string | undefined | null>(undefined);
  secondaryText = input<string | undefined>(undefined);
  picture = input<string | undefined>(undefined);
  link = input<string | undefined>(undefined);
  alt = input<string>();
  columnOrientation = input<boolean>(false);
}
