import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'feat-settings-cv',
  imports: [CommonModule],
  templateUrl: './cv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsCVComponent {}
