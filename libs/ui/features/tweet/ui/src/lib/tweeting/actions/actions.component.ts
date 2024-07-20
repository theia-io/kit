import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweeting-actions',
  template: `
    <div class="flex items-center">
      <button
        (click)="imageClick.emit()"
        class="w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:font-semibold hover:bg-neutral-200 transition ease-in-out duration-150"
      >
        <svg
          class="text-center h-7 w-6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </button>

      <!-- <button
        (click)="reaction.emit()"
        class="w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:font-semibold hover:bg-neutral-200 transition ease-in-out duration-150"
      >
        <svg
          class="text-center h-7 w-6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button> -->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FeatTweetTweetingActionsComponent {
  imageClick = output();
  reactionClick = output();
}
