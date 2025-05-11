import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FeatKitProfileBackgroundUploadableComponent,
  FeatKitProfilePictureUploadableComponent,
} from '@kitouch/feat-kit-ui';
import { FeatProfileApiActions, selectCurrentProfile } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { UiKitColorDisplayerComponent } from '@kitouch/ui-components';
import { Store } from '@ngrx/store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'feat-settings-profile-information',
  templateUrl: 'profile-information.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    UiKitColorDisplayerComponent,
    FeatKitProfilePictureUploadableComponent,
    FeatKitProfileBackgroundUploadableComponent,
    //
    InputTextModule,
    FloatLabelModule,
    InputTextarea,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSettingsProfileInformationComponent {
  #cdr = inject(ChangeDetectorRef);

  #store = inject(Store);

  profile = input.required<Profile>();
  withHints = input(false);
  updatingProfile = output<void>();

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  profileForm = inject(FormBuilder).nonNullable.group({
    alias: [
      '',
      [Validators.required, Validators.minLength(2), Validators.max(30)],
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.max(64)],
    ],
    title: ['', [Validators.minLength(2), Validators.max(256)]],
    subtitle: ['', [Validators.minLength(2), Validators.max(256)]],
    description: ['', [Validators.minLength(2), Validators.max(1024)]],
  });

  disabled = false;

  canEditProfile = computed(() => {
    const currentProfile = this.currentProfile(),
      profile = this.profile();

    return currentProfile && profile && currentProfile.id === profile.id;
  });

  constructor() {
    this.profileForm.valueChanges
      .pipe(
        filter(Boolean),
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((updatedProfile) => {
        this.#saveProfileHandler({
          ...this.profile(),
          ...updatedProfile,
        } as Profile);
      });

    effect(() => {
      const profile = this.profile();
      if (profile) {
        this.profileForm.setValue(
          {
            alias: profile.alias ?? profile.id,
            name: profile.name ?? '',
            title: profile.title ?? '',
            subtitle: profile.subtitle ?? '',
            description: profile.description ?? '',
          },
          { emitEvent: false },
        );
        /** @FIXME should it be handled better? Likely. However
         * it is said that changedetection is not called in effect
         * and they are good for other reasons - but how best to
         * implement this use-case?
         */
        this.#cdr.detectChanges();
      }
    });
  }

  #saveProfileHandler(profile: Profile) {
    this.updatingProfile.emit();
    /** @TODO p2 Add updatingProfile true/false and waiting for an action from Store with ID expected (uuid) */
    this.#store.dispatch(
      FeatProfileApiActions.updateProfile({
        profile,
      }),
    );
  }
}
