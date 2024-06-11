import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { Profile } from '@kitouch/shared/models';

export interface NavBarItem {
  name: string;
  link: string;
  icon: string;
}



@Component({
  selector: 'navbar',
  standalone: true,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    /** Features */
    SubnavComponent,
    DividerComponent,
    AccountTileComponent,
    TweetButtonComponent,
  ],
})
export class NavBarComponent {
  @Input()
  items: Array<NavBarItem> = [];

  @Input() 
  profiles: Array<Partial<Profile>> | undefined | null;

  @Output()
  logout = new EventEmitter<void>();

  @Output()
  help = new EventEmitter<void>();

  sanitizer: DomSanitizer = inject(DomSanitizer);
}
