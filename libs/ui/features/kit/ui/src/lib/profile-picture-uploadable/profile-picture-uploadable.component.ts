import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FeatProfileApiActions,
  profilePicture,
  selectProfileById,
} from '@kitouch/kit-data';
import { S3_PROFILE_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { merge, take, tap } from 'rxjs';

@Component({
  selector: 'feat-kit-profile-picture-uploadable',
  templateUrl: './profile-picture-uploadable.component.html',
  imports: [
    //
    ToastModule,
    FileUploadModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO refactor to include UiKitPicUploadableComponent
export class FeatKitProfilePictureUploadableComponent {
  currentProfile = input.required<Profile | null | undefined>();
  profile = input.required<Profile | null | undefined>();

  canUploadProfilePic = computed(() => {
    const currentProfile = this.currentProfile(),
      profile = this.profile();

    return currentProfile && profile && currentProfile.id === profile.id;
  });
  profilePic = computed(() => {
    const profile = this.profile();
    if (profile) {
      return profilePicture(
        this.#store.selectSignal(selectProfileById(profile.id))(),
      );
    } else {
      return profilePicture(profile);
    }
  });

  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #actions = inject(Actions);

  #s3ProfileBaseUrl = inject(S3_PROFILE_BUCKET_BASE_URL);
  #messageService = inject(MessageService);
  #confirmationService = inject(ConfirmationService);

  @ViewChild('fileUploadCmp', { read: FileUpload, static: false })
  fileUploadCmp: FileUpload;

  openPopup(event: Event) {
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
          '.p-fileupload-choose',
        ) as HTMLElement | null
      )?.click();
    }, 100);
  }

  onBasicUploadAuto(event: FileUploadHandlerEvent) {
    const canUpload = this.canUploadProfilePic(),
      profile = this.currentProfile(),
      file = event.files[0];

    if (!canUpload || !profile || !file) {
      console.error('Cannot Upload new profile pic');
      return;
    }

    merge(
      this.#actions
        .pipe(ofType(FeatProfileApiActions.uploadProfilePictureSuccess))
        .pipe(
          tap(() => {
            this.#messageService.add({
              severity: 'info',
              summary: 'Profile picture uploaded',
            });
            this.#confirmationService.close();
          }),
          tap(({ url }) =>
            this.confirmNewProfilePic(
              profile,
              `${this.#s3ProfileBaseUrl}/${url}`,
            ),
          ),
        ),
      this.#actions
        .pipe(ofType(FeatProfileApiActions.uploadProfilePictureFailure))
        .pipe(
          tap(() => {
            this.#messageService.add({
              severity: 'error',
              summary: 'Upload failed',
            });
          }),
        ),
    )
      .pipe(takeUntilDestroyed(this.#destroyRef), take(1))
      .subscribe(() => this.fileUploadCmp.clear());

    this.#store.dispatch(
      FeatProfileApiActions.uploadProfilePicture({
        id: `${profile.id}/${file.name}`,
        pic: file,
      }),
    );
  }

  confirmNewProfilePic(currentProfile: Profile, url: string) {
    this.#confirmationService.confirm({
      message: url,
      key: 'confirm',
      header: 'Confirm new profile picture',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.#messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have updated profile picture',
        });
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              pictures: [
                {
                  url,
                  isPrimary: true,
                },
              ],
            },
          }),
        );
      },
      reject: () => {
        this.#messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected new profile picture',
          life: 3000,
        });
      },
    });
  }
}
