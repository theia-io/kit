import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'feat-offboarding-ui-offboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-offboarding.component.html',
  styleUrl: './ui-offboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiOffboardingComponent {}
