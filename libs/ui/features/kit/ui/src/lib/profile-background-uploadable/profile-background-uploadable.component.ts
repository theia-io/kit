import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatProfileApiActions, selectProfileById } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColorPicker, ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { FeatKitProfileBackgroundComponent } from '../profile-background/profile-background.component';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-background-uploadable',
  templateUrl: './profile-background-uploadable.component.html',
  imports: [
    //
    FormsModule,
    //
    FeatKitProfileBackgroundComponent,
    //
    ToastModule,
    ColorPickerModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKitProfileBackgroundUploadableComponent {
  profileId = input.required<Profile['id']>();

  profile = computed(() => {
    return this.#store.selectSignal(selectProfileById(this.profileId()))();
  });

  backgroundColor: string | undefined = undefined;

  #store = inject(Store);

  #messageService = inject(MessageService);
  #confirmationService = inject(ConfirmationService);

  @ViewChild(ColorPicker)
  colorPickerTpl: ColorPicker;

  constructor() {
    effect(() => {
      console.log('PROFILE UPDATED', this.profile());
      this.backgroundColor = this.profile()?.background;
    });
  }

  colorPickerClickHandler() {
    const natNgEl: HTMLElement = this.colorPickerTpl.el.nativeElement;
    natNgEl.querySelector('input')?.click();
  }

  onChangeHandler(currentProfile: Profile | undefined) {
    console.log(
      'onChangeHandler',
      event,
      this.backgroundColor,
      this.profile()?.background,
      this.profile()?.background !== this.backgroundColor
    );
    if (currentProfile && currentProfile.background !== this.backgroundColor) {
      this.#confirmationService.confirm({
        message: this.backgroundColor,
        key: 'confirm',
        header: 'Confirm new profile background',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.#messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'You have updated profile background',
          });
          this.#store.dispatch(
            FeatProfileApiActions.updateProfile({
              profile: {
                ...currentProfile,
                background: this.backgroundColor,
              },
            })
          );
        },
        reject: () => {
          this.#messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected new profile background',
            life: 3000,
          });
        },
      });
    }
  }
}
