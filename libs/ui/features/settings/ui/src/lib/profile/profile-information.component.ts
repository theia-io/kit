import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
})
export class FeatSettingsProfileInformationComponent {
  profile = input<Profile | null>(null);
  profilePic = input<string | null>(null);

  profileForm = inject(FormBuilder).group({
    alias: [
      this.profile()?.alias ?? this.profile()?.id ?? '',
      [Validators.minLength(2), Validators.max(30)],
    ],
    name: [
      this.profile()?.name ?? '',
      [Validators.required, Validators.minLength(2), Validators.max(256)],
    ],
    title: [
      this.profile()?.title ?? '',
      [Validators.minLength(2), Validators.max(1024)],
    ],
    subtitle: [
      this.profile()?.subtitle ?? '',
      [Validators.minLength(2), Validators.max(1024)],
    ],
    description: [
      this.profile()?.description ?? '',
      [Validators.minLength(2), Validators.max(5096)],
    ],
  });

  constructor() {
    effect(() => {
      const { id, alias, name, title, subtitle, description } =
        this.profile() ?? {};

      this.profileForm.setValue({
        alias: alias ?? id ?? '',
        name: name ?? '',
        title: title ?? '',
        subtitle: subtitle ?? '',
        description: description ?? '',
      });
    });
  }
}
