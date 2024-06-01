import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TweetButtonComponent } from '@kitouch/ui/components';
import { MyAccountTileComponent } from '@kitouch/ui/features/account';

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
    RouterModule,
    /** Features */
    MyAccountTileComponent,
    TweetButtonComponent,
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
