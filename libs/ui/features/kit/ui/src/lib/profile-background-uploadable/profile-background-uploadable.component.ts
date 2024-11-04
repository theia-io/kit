import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatProfileApiActions, selectProfileById } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { UiKitColorPickerComponent } from '@kitouch/ui-components';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
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
    ToastModule,
    ColorPickerModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    //
    FeatKitProfileBackgroundComponent,
    UiKitColorPickerComponent,
  ],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKitProfileBackgroundUploadableComponent {
  profileId = input.required<Profile['id']>();

  profile = computed(() => {
    return this.#store.selectSignal(selectProfileById(this.profileId()))();
  });

  #store = inject(Store);
  #messageService = inject(MessageService);

  colorAcceptedHandler(colorHex: string, profile: Profile) {
    this.#messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'You have updated profile background',
    });
    this.#store.dispatch(
      FeatProfileApiActions.updateProfile({
        profile: {
          ...profile,
          background: colorHex,
        },
      })
    );
  }

  colorRejectedHandler() {
    this.#messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected new profile background',
      life: 3000,
    });
  }
}
