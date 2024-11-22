import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-containers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './containers.component.html',
  styleUrl: './containers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainersComponent {}
