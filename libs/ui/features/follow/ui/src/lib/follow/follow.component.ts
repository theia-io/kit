import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AccountTileComponent,
  FollowButtonComponent,
} from '@kitouch/ui/components';

@Component({
  selector: 'follow',
  standalone: true,
  imports: [
    CommonModule,
    //
    FollowButtonComponent,
    AccountTileComponent,
  ],
  templateUrl: './follow.component.html',
  styleUrl: './follow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowComponent {}
