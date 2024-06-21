import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-feat-settings-experience-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //

    //
  ],
  templateUrl: './experience-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsExperienceAddComponent {}
