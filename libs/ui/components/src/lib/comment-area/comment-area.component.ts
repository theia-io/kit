import { NgOptimizedImage, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractUploadedMedia, FarewellComment } from '@kitouch/shared-models';
import { PhotoService } from '@kitouch/ui-shared';
import PhotoSwipe from 'photoswipe';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import { Observable } from 'rxjs';
import { UiKitTweetButtonComponent } from '../tweet-button/tweet-button.component';
import { UiKitPicUploadableComponent } from '../uploadable/uploadable.component';
import { UiKitDeleteComponent } from '../delete/delete.component';

const CONTROL_INITIAL_ROWS = 2;

export interface AddComment {
  content: FarewellComment['content'];
  medias: FarewellComment['medias'];
}

@Component({
  standalone: true,
  selector: 'ui-kit-comment-area',
  templateUrl: './comment-area.component.html',
  imports: [
    //
    ReactiveFormsModule,
    NgOptimizedImage,
    NgStyle,
    //
    FloatLabelModule,
    InputTextareaModule,
    TimelineModule,
    ButtonModule,
    //
    UiKitTweetButtonComponent,
    UiKitPicUploadableComponent,
    UiKitDeleteComponent,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIKitCommentAreaComponent implements AfterViewInit {
  placeholder = input<string>('Got a reply?');

  maxMediaFiles = input<number>(0);
  uploadMediaFilesCb =
    input<(files: Array<File>) => Observable<Array<ContractUploadedMedia>>>();
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

  uploadedMedias = signal<NonNullable<FarewellComment['medias']>>([]);

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
      this.uploadedMedias.update((medias) => [...medias, ...mediaUrls]);
    });
  }

  deleteHandler(media: ContractUploadedMedia) {
    const deleteFn = this.deleteMediaFilesCb();
    if (!deleteFn) {
      console.error(
        'UIKitCommentAreaComponent delete function is not provided but delete is called'
      );
      return;
    }

    media.optimizedUrls.concat(media.url).forEach((url) => {
      deleteFn(url);
    });

    this.uploadedMedias.update((existingMedias) =>
      existingMedias.filter((existingMedia) => existingMedia.url !== media.url)
    );
  }

  commentControlBlur() {
    if (!this.commentContentControl.value?.length) {
      this.commentContentControlRows = CONTROL_INITIAL_ROWS;
      return;
    }
  }

  mediaType(mediaUrl: string) {
    return mediaUrl.split('.').reverse()[0];
  }

  mediaWidthRatio(height: number, width: number) {
    return width / height;
  }
}
