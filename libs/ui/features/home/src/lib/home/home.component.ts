import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyAccountTileComponent } from '@kitouch/ui/account';
import { TweetComponent } from '@kitouch/ui/tweet';

@Component({
  standalone: true,
  imports: [CommonModule, MyAccountTileComponent, TweetComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
