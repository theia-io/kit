import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-feat-settings-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsExperienceComponent {}
