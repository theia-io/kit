import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {UiKitTweetButtonTestComponent} from '@kitouch/components-test';

@Component({
  standalone: true,
  imports: [CommonModule, UiKitTweetButtonTestComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {}
