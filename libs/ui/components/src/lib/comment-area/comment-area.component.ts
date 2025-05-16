import { AsyncPipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractUploadedMedia, FarewellComment } from '@kitouch/shared-models';
import { DeviceService, PhotoService } from '@kitouch/shared-services';
import PhotoSwipe from 'photoswipe';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TimelineModule } from 'primeng/timeline';
import { Observable } from 'rxjs';
import { UiKitDeleteComponent } from '../delete/delete.component';
import { UiKitSpinnerComponent } from '../spinner/spinner.component';
import { UiKitTweetButtonComponent } from '../tweet-button/tweet-button.component';
import { UiKitPicUploadableComponent } from '../uploadable/uploadable.component';

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
    AsyncPipe,
    NgClass,
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
    UiKitSpinnerComponent,
    //
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIKitCommentAreaComponent implements AfterViewInit {
  placeholder = input<string>('Got a reply?');
  actionBtnText = input('Comment');
  validators = input([
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
  ]);
  maxMediaFiles = input<number>(0);
  uploadMediaFilesCb =
    input<(files: Array<File>) => Observable<Array<ContractUploadedMedia>>>();
  deleteMediaFilesCb = input<(imageUrl: string) => void>();

  comment = output<AddComment>();

  #photoService = inject(PhotoService);
  deviceService = inject(DeviceService);

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

  commentContentControl = new FormControl<string>('');
  commentContentControlRows = CONTROL_INITIAL_ROWS;

  // TODO make media part of commentContentControl (Form), so validation can take into account control and media added as one entity
  uploadedMedias = signal<NonNullable<FarewellComment['medias']>>([]);

  uploadingMedia = signal(false);

  constructor() {
    effect(() => {
      this.commentContentControl.setValidators(
        this.validators().map((validator) => validator.bind(this))
      );
      this.commentContentControl.updateValueAndValidity();
    });
  }

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

    if (!valid) {
      console.warn(
        `[UIKitCommentAreaComponent] content: ${content}, validity: ${valid}.`
      );
      return;
    }

    this.comment.emit({
      content: content ?? '',
      medias: this.uploadedMedias(),
    });
    this.uploadedMedias.set([]);
    this.commentContentControl.reset();
    this.commentControlBlur();
  }

  filesHandler(files: Array<File>) {
    const uploadFn = this.uploadMediaFilesCb();
    if (!uploadFn) {
      console.error(
        '[UIKitCommentAreaComponent] upload function was not provided'
      );
      return;
    }

    this.uploadingMedia.set(true);

    uploadFn(files).subscribe((mediaUrls) => {
      this.uploadingMedia.set(false);
      this.commentContentControlRows = 4;
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

    this.commentControlBlur();
  }

  commentControlBlur() {
    if (
      !this.commentContentControl.value?.length &&
      this.uploadedMedias().length === 0
    ) {
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
