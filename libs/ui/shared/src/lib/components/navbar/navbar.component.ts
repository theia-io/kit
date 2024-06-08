import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  AccountTileComponent,
  DividerComponent,
  TweetButtonComponent,
} from '@kitouch/ui/components';
import { SubnavComponent } from './subnav/subnav.component';

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
    SubnavComponent,
    DividerComponent,
    AccountTileComponent,
    TweetButtonComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  @Input()
  items: Array<NavBarItem> = [];

  @Output()
  logout = new EventEmitter<void>();

  sanitizer: DomSanitizer = inject(DomSanitizer);
}
