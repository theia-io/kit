import { NgClass, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  Directive,
  inject,
  input,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { Nullable } from 'primeng/ts-helpers';

@Directive({
  standalone: true,
  selector: '[uiKitPicUploadableTemplate]',
})
export class UiKitPicUploadableDirective {
  constructor(public template: TemplateRef<any>) {}
}

export interface UploadableDefaultImage {
  src: string;
  alt: string;
}
export interface UploadableDefaultIcon {
  ngClass: Array<string>;
}

export interface UploadConf {
  withIcon: boolean;
  fileUploadConf: Partial<FileUpload>;
}

export const UPLOAD_CONF_DEFAULT: UploadConf = {
  withIcon: true,
  fileUploadConf: {
    multiple: false,
  },
};

@Component({
  selector: 'ui-kit-pic-uploadable',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    NgTemplateOutlet,
    //
    FileUploadModule,
    ConfirmPopupModule,
    //
  ],
  templateUrl: './uploadable.component.html',
  providers: [ConfirmationService],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitPicUploadableComponent {
  defaultTmplConf = input<{
    imageConf?: Partial<UploadableDefaultImage>;
    iconConf?: Partial<UploadableDefaultIcon>;
  }>();

  conf = input(UPLOAD_CONF_DEFAULT, {
    transform: (conf: Partial<UploadConf>): Partial<UploadConf> => ({
      ...UPLOAD_CONF_DEFAULT,
      ...conf,
      fileUploadConf: {
        ...UPLOAD_CONF_DEFAULT?.fileUploadConf,
        ...conf?.fileUploadConf,
      },
    }),
  });

  /** Likely you should make sure correct Context, run `.bind(this)` while providing this value.
   */
  /** @deprecated use files instead */
  autoUploadCb = input<(event: FileUploadHandlerEvent) => unknown>();

  files = output<Array<File>>();

  autoUploadCbMonkeyPatched = computed(() => {
    const original = this.autoUploadCb();

    return (event: FileUploadHandlerEvent) => {
      if (original) {
        original(event);
      }
      this.files.emit(event.files);

      // TODO handle when closed with esc
      // primeng does not seem to support this OOTB
      // https://github.com/primefaces/primeng/blob/master/src/app/components/fileupload/fileupload.ts#L195
      this.#confirmationService.close();
    };
  });

  @ViewChild('fileUploadCmp', { read: FileUpload, static: false })
  fileUploadCmp: FileUpload;

  @ContentChild(UiKitPicUploadableDirective)
  customTmpl: Nullable<UiKitPicUploadableDirective>;

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
