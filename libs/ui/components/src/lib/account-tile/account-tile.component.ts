import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-comp-account-tile',
  standalone: true,
  templateUrl: './account-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
})
export class AccountTileComponent {
  @Input()
  primaryText = '';

  @Input()
  primarySecondaryText: string | undefined | null = undefined;

  @Input()
  secondaryText: string | undefined = undefined;

  @Input()
  picture: string | undefined = undefined;

  @Input()
  link: string | undefined = undefined;
}
