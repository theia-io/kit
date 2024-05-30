import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'follow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './follow.component.html',
  styleUrl: './follow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowComponent {}
