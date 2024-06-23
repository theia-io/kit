import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatSettingsExperienceAddComponent } from '@kitouch/features/settings/ui';

@Component({
  standalone: true,
  selector: 'kit-page-about-yourself',
  templateUrl: './about-yourself.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    //
    //
    FeatSettingsExperienceAddComponent,
  ],
})
export class PageAboutYourselfComponent {}
