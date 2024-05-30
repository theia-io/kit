import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NAV_ITEMS, NavBarComponent } from '../../../index';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  navBarItems = NAV_ITEMS;
}
