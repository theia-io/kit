import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatFollowSuggestionsComponent, FollowComponent } from '@kitouch/ui/features/follow/ui';
import { GlobalSearchComponent } from '@kitouch/ui/features/search';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    CommonModule,
     FollowComponent,
      GlobalSearchComponent,
      FeatFollowSuggestionsComponent
    ],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  year = new Date().getFullYear();
}
