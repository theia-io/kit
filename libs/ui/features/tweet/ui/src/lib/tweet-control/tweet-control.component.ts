import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'feat-tweet-control',
  templateUrl: './tweet-control.component.html',
  imports: [ReactiveFormsModule],
})
export class FeatTweetControlComponent {
  tweetContentControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);

  placeholderText = `Share anything:
      - got an idea to share?
      - got a new certification?
      - got a new job?
      - wrote an article or looking for collaborators?
      - looking for a open-source projects to join?`;
}
