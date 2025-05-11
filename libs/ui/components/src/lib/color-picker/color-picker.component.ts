import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ColorPicker, ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'ui-kit-color-picker',
  imports: [
    //
    FormsModule,
    NgStyle,
    NgTemplateOutlet,
    //
    ColorPickerModule,
    ConfirmDialogModule,
    ButtonModule,
  ],
  templateUrl: './color-picker.component.html',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitColorPickerComponent {
  currentColor = input<string>();

  colorAccepted = output<string>();
  colorRejected = output<void>();

  #confirmationService = inject(ConfirmationService);

  @ViewChild(ColorPicker)
  colorPickerTpl: ColorPicker;

  newColor?: string;

  constructor() {
    effect(() => {
      this.newColor = this.currentColor();
    });
  }

  colorPickerClickHandler() {
    const natNgEl: HTMLElement = this.colorPickerTpl.el.nativeElement;
    natNgEl.querySelector('input')?.click();
  }

  onChangeHandler() {
    const newColor = this.newColor;
    if (!newColor) {
      return;
    }

    const currentColor = this.currentColor();
    if (!currentColor) {
      this.colorAccepted.emit(newColor);
      return;
    }

    if (newColor) {
      this.#confirmationService.confirm({
        message: newColor,
        key: 'confirm',
        header: 'Confirm color',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => this.colorAccepted.emit(newColor),
        reject: () => this.colorRejected.emit(),
      });
    }
  }
}
