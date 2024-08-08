import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Experience } from '@kitouch/shared-models';

@Component({
  standalone: true,
  selector: 'feat-settings-experience-show',
  templateUrl: './experience-show.component.html',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsExperienceShowComponent {
  experience = input.required<Experience>();
  showRemove = input(false);

  deleteExperience = output<Experience>();
}
