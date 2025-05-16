import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Device, DeviceService } from '@kitouch/shared-services';
import {
  UiKitPicUploadableComponent,
  UiKitPicUploadableDirective,
} from '@kitouch/ui-components';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Bounds } from 'quill';

@Component({
  standalone: true,
  selector: 'feat-farewell-quill-side-actions',
  templateUrl: './quill-side-actions.component.html',
  imports: [
    NgStyle,
    FormsModule,
    //
    UiKitPicUploadableComponent,
    UiKitPicUploadableDirective,
    //
    ToggleButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellQuillSideActionsComponent {
  bounds = input.required<Bounds | null>();
  show = model.required<boolean>();

  opened = signal<boolean>(false);
  /** same implementation as Angular 18.2.7 (ngModelChange), [Github](https://github.com/angular/angular/blob/9dbe6fc18be700e89f28a023378f4775f3f7c3fe/packages/forms/src/directives/ng_model.ts#L231). Should not there be a better way subscribing on Signal? */
  sideActionOpened = output<boolean>();

  imageFiles = output<Array<File>>();
  divider = output<void>();

  device = toSignal(inject(DeviceService).device$);
  currentDevice = Device;

  constructor() {
    effect(
      () => {
        if (!this.show()) {
          this.opened.set(false);
        }
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(() => {
      this.sideActionOpened.emit(this.opened());
    });
  }

  onBasicUploadAuto(event: FileUploadHandlerEvent) {
    const newFiles = event.files;
    this.imageFiles.emit(newFiles);
    this.opened.set(false);
  }

  onDivider() {
    this.divider.emit();
    this.opened.set(false);
  }
}
