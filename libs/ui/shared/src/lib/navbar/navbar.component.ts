import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

export interface NavBarItem {
  name: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  @Input()
  items: Array<NavBarItem> = [];

  sanitizer: DomSanitizer = inject(DomSanitizer);
}
