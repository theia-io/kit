import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  NgZone,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import { Observable } from 'rxjs';
import { UiKitTweetButtonComponent } from '../tweet-button/tweet-button.component';
import { UiKitPicUploadableComponent } from '../uploadable/uploadable.component';
import { PhotoService } from '@kitouch/ui-shared';
import PhotoSwipe from 'photoswipe';

const CONTROL_INITIAL_ROWS = 2;

export interface AddComment {
  content: string;
  medias: Array<string>;
}

@Component({
  standalone: true,
  selector: 'ui-kit-comment-area',
  templateUrl: './comment-area.component.html',
  imports: [
    //
    ReactiveFormsModule,
    NgOptimizedImage,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UiKitTweetButtonComponent,
    UiKitPicUploadableComponent,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIKitCommentAreaComponent implements AfterViewInit {
  placeholder = input<string>('Got a reply?');

  maxMediaFiles = input<number>(0);
  uploadMediaFilesCb =
    input<(files: Array<File>) => Observable<Array<string>>>();
  deleteMediaFilesCb = input<(imageUrl: string) => void>();

  comment = output<AddComment>();

  #photoService = inject(PhotoService);

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

  uploadedMedias = signal<Array<string>>([]);

  ngAfterViewInit(): void {
    if (this.maxMediaFiles() > 0) {
      this.#photoService.initializeGallery({
        gallery: '#uploaded-comment-media-gallery',
        children: 'a',
        pswpModule: PhotoSwipe,
      });
    }
  }

  commentHandler() {
    const content = this.commentContentControl.value,
      valid = this.commentContentControl.valid;
    if (!valid || !content) {
      console.warn(
        `[UIKitCommentAreaComponent] content: ${content}, validity: ${valid}.`
      );
      return;
    }

    this.comment.emit({ content, medias: this.uploadedMedias() });
    this.uploadedMedias.set([]);
    this.commentContentControl.reset();
  }

  filesHandler(files: Array<File>) {
    const uploadFn = this.uploadMediaFilesCb();
    if (!uploadFn) {
      console.error(
        '[UIKitCommentAreaComponent] upload function was not provided'
      );
      return;
    }

    uploadFn(files).subscribe((mediaUrls) => {
      this.uploadedMedias.update((medias) => [...mediaUrls, ...medias]);
    });
  }

  commentControlBlur() {
    if (!this.commentContentControl.value?.length) {
      this.commentContentControlRows = CONTROL_INITIAL_ROWS;
      return;
    }
  }
}
