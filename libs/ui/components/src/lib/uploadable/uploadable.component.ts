import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';

@Component({
  selector: 'ui-kit-pic-uploadable',
  standalone: true,
  imports: [
    NgOptimizedImage,
    //
    //
    FileUploadModule,
    ConfirmPopupModule,
  ],
  templateUrl: './uploadable.component.html',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadablePicComponent {
  /** src of image */
  imgConf = input.required<{ src: string; alt?: string }>();

  autoUploadCb = input.required<(event: FileUploadHandlerEvent) => void>();

  @ViewChild('fileUploadCmp', { read: FileUpload, static: false })
  fileUploadCmp: FileUpload;

  #confirmationService = inject(ConfirmationService);

  uploadInstantly(event: Event) {
    this.#confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'upload',
      acceptVisible: false,
      rejectVisible: false,
      closeOnEscape: true,
    });

    // TODO FIXME refactor to remove settimeout but keep UX actions to 1
    setTimeout(() => {
      (
        (this.fileUploadCmp as any).el.nativeElement?.querySelector(
          '.p-fileupload-choose'
        ) as HTMLElement | null
      )?.click();
    }, 100);
  }
}
