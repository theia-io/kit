import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feat-farewell-ui.component.html',
  styleUrl: './feat-farewell-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellUiComponent {}
