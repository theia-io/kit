import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyAccountTileComponent } from '@kitouch/ui/features/account';
import { TweetComponent } from '@kitouch/ui/features/tweet';

@Component({
  standalone: true,
  imports: [CommonModule, MyAccountTileComponent, TweetComponent],
  templateUrl: './join.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinComponent {}
