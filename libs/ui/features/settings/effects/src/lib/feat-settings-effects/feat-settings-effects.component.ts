import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-feat-settings-effects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feat-settings-effects.component.html',
  styleUrl: './feat-settings-effects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsEffectsComponent {}
