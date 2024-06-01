import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmarks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksComponent {}
