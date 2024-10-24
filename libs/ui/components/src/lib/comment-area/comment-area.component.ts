import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import { UiKitTweetButtonComponent } from '../tweet-button/tweet-button.component';

const CONTROL_INITIAL_ROWS = 2;

@Component({
  standalone: true,
  selector: 'ui-kit-comment-area',
  templateUrl: './comment-area.component.html',
  imports: [
    //
    AsyncPipe,
    ReactiveFormsModule,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UiKitTweetButtonComponent,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIKitCommentAreaComponent {
  placeholder = input<string>('Got a reply?');

  comment = output<string>();

  @HostListener('window:keydown', ['$event'])
  keyDownEnterHandler(event: KeyboardEvent) {
    if (
      this.commentContentControl.valid &&
      event.key === 'Enter' &&
      (event.metaKey || event.ctrlKey) // Check for Cmd/Ctrl key
    ) {
      this.commentHandler();
    }
  }

  commentContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);
  commentContentControlRows = CONTROL_INITIAL_ROWS;

  commentHandler() {
    const content = this.commentContentControl.value,
      valid = this.commentContentControl.valid;
    if (!valid || !content) {
      console.warn(
        `[UIKitCommentAreaComponent] content: ${content}, validity: ${valid}.`
      );
      return;
    }

    this.comment.emit(content);

    this.commentContentControl.reset();
    // this.commentContentControlRows = TWEET_CONTROL_INITIAL_ROWS;
  }

  commentControlBlur() {
    if (!this.commentContentControl.value?.length) {
      this.commentContentControlRows = CONTROL_INITIAL_ROWS;
      return;
    }
  }
}
