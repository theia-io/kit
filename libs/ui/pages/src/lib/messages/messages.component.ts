import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {}
