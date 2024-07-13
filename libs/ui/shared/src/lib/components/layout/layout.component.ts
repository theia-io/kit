import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FollowComponent } from '@kitouch/ui/features/follow/ui';
import { GlobalSearchComponent } from '@kitouch/ui/features/search';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [CommonModule, FollowComponent, GlobalSearchComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  year = new Date().getFullYear();
}
