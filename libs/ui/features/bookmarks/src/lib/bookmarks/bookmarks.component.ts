import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksComponent {}
