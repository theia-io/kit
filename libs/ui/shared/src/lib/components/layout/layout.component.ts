import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FollowComponent } from '@kitouch/ui/features/follow';
import { LegalComponent } from '@kitouch/ui/features/legal';
import { SearchComponent } from '@kitouch/ui/features/search';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    CommonModule,
    FollowComponent,
    SearchComponent,
    LegalComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
}
