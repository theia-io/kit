import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '@kitouch/ui/shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    /** Features */
    LayoutComponent,
  ],
  templateUrl: './kit.component.html',
  styleUrl: './kit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitComponent {
  title = 'Kitouch';
}
