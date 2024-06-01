
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyAccountTileComponent } from '@kitouch/ui/features/account';
import { TweetComponent } from '@kitouch/ui/features/tweet';

@Component({
  standalone: true,
  imports: [CommonModule, MyAccountTileComponent, TweetComponent],
  templateUrl: './tweets.component.html',
  styleUrl: './tweets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetsComponent {}
