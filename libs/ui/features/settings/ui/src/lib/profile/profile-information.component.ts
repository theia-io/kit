import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { profilePicture } from '@kitouch/features/kit/data';
import { Profile } from '@kitouch/shared/models';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  standalone: true,
  selector: 'feat-settings-profile-information',
  templateUrl: 'profile-information.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    //
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FeatSettingsProfileInformationComponent,
    },
    // {
    //   provide: NG_VALIDATORS,
    //   multi: true,
    //   useExisting: FeatSettingsProfileInformationComponent,
    // },
  ],
}) //, Validator
export class FeatSettingsProfileInformationComponent
  implements ControlValueAccessor
{
  @Input()
  profilePic: string | null;

  @Output()
  valid = new EventEmitter<boolean>();

  profileForm = inject(FormBuilder).nonNullable.group({
    alias: [
      '',
      [Validators.required, Validators.minLength(2), Validators.max(30)],
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.max(256)],
    ],
    title: ['', [Validators.minLength(2), Validators.max(1024)]],
    subtitle: ['', [Validators.minLength(2), Validators.max(1024)]],
    description: ['', [Validators.minLength(2), Validators.max(5096)]],
  });

  onChange: (profile: Partial<Profile>) => void;
  // onValidationChange: any = () => {};
  disabled = false;

  constructor() {
    this.profileForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((profile) => {
        this.onChange(profile);
        // this.onValidationChange();
      });
  }

  writeValue(profile: Partial<Profile>) {
    // console.log('[CHILD] writeValue', profile);
    this.profileForm.patchValue(
      {
        ...profile,
        alias: profile.alias ?? profile.id ?? '',
      },
      { emitEvent: false }
    );

    if (profile.pictures) {
      this.profilePic = profilePicture(profile);
    }
  }

  registerOnChange(onChange: (profile: Partial<Profile>) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(_: unknown) {
    // implement once mobile is supported
  }

  markAsTouched() {
    // implement once mobile is supported
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  // registerOnValidatorChange?(fn: () => void): void {
  //   this.onValidationChange = fn;
  // }

  // validate(control: AbstractControl): ValidationErrors | null {
  //   console.log('[CHILD] validate', control.valid, this.profileForm.valid, control, this.profileForm)
  //   const errors = this.profileForm.errors; // Get errors from the profileForm

  //   // Set a custom validation status to indicate if the entire profileForm is valid
  //   control.setErrors(
  //     this.profileForm.valid
  //       ? null
  //       : { ...this.profileForm.errors, profileInvalid: true }
  //   );

  //   console.log('control', this.profileForm.valid);

  //   this.valid.emit(this.profileForm.valid);

  //   return errors; // Return the specific errors for individual controls
  // }
}
