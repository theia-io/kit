import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatTweetActions } from '@kitouch/feat-tweet-data';
import { Tweety } from '@kitouch/shared/models';
import { AccountTileComponent } from '@kitouch/ui/components';
import { Store } from '@ngrx/store';
import { FeatTweetActionsComponent } from './actions/actions.component';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    //
    FeatTweetActionsComponent,
    AccountTileComponent,
  ],
})
export class FeatTweetTweetyComponent {
  @Input({ required: true })
  tweet!: Tweety;

  domSanitizer = inject(DomSanitizer);

  #store = inject(Store);

  commentHandler() {
    console.info('Implement commentHandler');
  }

  repostHandler() {
    console.info('Implement repostHandler');
  }

  likeHandler() {
    this.#store.dispatch(FeatTweetActions.like({ tweet: this.tweet }));
  }

  shareHandler() {
    console.info('Implement shareHandler');
  }

  bookmarkHandler() {
    console.info('Implement bookmarkHandler');
  }
}
