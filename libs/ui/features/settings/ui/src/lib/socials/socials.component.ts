import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FeatProfileApiActions } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

export const URL_PATTERN =
  '^(https?:\\/\\/)?' + // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
  '(\\#[-a-z\\d_]*)?$';

const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(URL_PATTERN, 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
};

@Component({
  standalone: true,
  selector: 'feat-settings-socials',
  templateUrl: './socials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    //
    TooltipModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    //
  ],
})
export class FeatSettingsSocialsComponent {
  profile = input.required<Profile | null>();
  savingSocials = output<void>();

  #store = inject(Store);
  #cdr = inject(ChangeDetectorRef);

  socialForm = inject(FormBuilder).group({
    linkedin: new FormControl('', Validators.pattern(URL_PATTERN)),
    github: new FormControl('', Validators.pattern(URL_PATTERN)),
    twitter: new FormControl('', Validators.pattern(URL_PATTERN)),
    facebook: new FormControl('', Validators.pattern(URL_PATTERN)),
    instagram: new FormControl('', Validators.pattern(URL_PATTERN)),
    whatsapp: new FormControl('', Validators.pattern(URL_PATTERN)),
    youtube: new FormControl('', Validators.pattern(URL_PATTERN)),
  });

  constructor() {
    this.socialForm.valueChanges.subscribe((v) => {
      console.log(v, this.socialForm.valid);
    });

    effect(() => {
      const socials = this.profile()?.socials;
      if (socials) {
        this.socialForm.setValue(socials, { emitEvent: false });
        this.#cdr.detectChanges();
      }
    });

    this.socialForm.valueChanges
      .pipe(
        // skip(1),
        filter(Boolean),
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((updatedProfileSocials) => {
        const profile = this.profile();
        console.log(updatedProfileSocials, profile);
        this.#saveSocialsHandler({
          ...profile,
          socials: {
            ...profile?.socials,
            ...updatedProfileSocials,
          },
        } as Profile);
      });
  }

  #saveSocialsHandler(profile: Profile) {
    if (this.socialForm.invalid) {
      return;
    }

    this.savingSocials.emit();
    console.log(profile, this.socialForm.valid, this.socialForm.value);
    this.#store.dispatch(
      FeatProfileApiActions.updateProfile({
        profile,
      })
    );
  }
}
