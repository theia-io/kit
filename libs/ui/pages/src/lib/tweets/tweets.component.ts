import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AccountTileComponent,
  TweetButtonComponent,
} from '@kitouch/ui/components';

@Component({
  standalone: true,
  imports: [CommonModule, AccountTileComponent, TweetButtonComponent],
  templateUrl: './tweets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetsComponent {}
