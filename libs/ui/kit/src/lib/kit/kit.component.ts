import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent, NAV_ITEMS, NavBarComponent } from '@kitouch/ui/shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    /** Features */
    LayoutComponent,
    NavBarComponent,
  ],
  templateUrl: './kit.component.html',
  styleUrl: './kit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitComponent {
  title = 'Kitouch';
  
  navBarItems = NAV_ITEMS;
}
