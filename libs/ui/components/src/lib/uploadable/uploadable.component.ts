import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
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
    NgClass,
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
export class UiKitPicUploadableComponent {
  /** src of image */
  imgConf = input.required<{ src: string; alt?: string }>();
  iconConf = model<{ ngClass?: Array<string> }>();
  fileUploadConf = input<Partial<FileUpload>>();

  /** Likely you should make sure correct Context, run `.bind(this)` while providing this value.
   */
  autoUploadCb = input.required<(event: FileUploadHandlerEvent) => void>();

  autoUploadCbMonkeyPatched = computed(() => {
    const original = this.autoUploadCb();

    return (event: FileUploadHandlerEvent) => {
      original(event);
      // TODO handle when closed with esc
      // primeng does not seem to support this OOTB
      // https://github.com/primefaces/primeng/blob/master/src/app/components/fileupload/fileupload.ts#L195
      this.#confirmationService.close();
    };
  });

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
