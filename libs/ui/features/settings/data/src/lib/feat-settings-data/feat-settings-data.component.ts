import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-feat-settings-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feat-settings-data.component.html',
  styleUrl: './feat-settings-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsDataComponent {}
