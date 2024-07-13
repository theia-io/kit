import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  FeatLegalApiActions,
  FeatProfileApiActions,
  FeatUserApiActions,
  selectCurrentProfile,
} from '@kitouch/features/kit/data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsProfileInformationComponent,
} from '@kitouch/features/settings/ui';
import { Experience, Profile } from '@kitouch/shared/models';
import { fadeInUpAnimation } from '@kitouch/ui/components';
import { FeatFollowSuggestionsComponent } from '@kitouch/ui/features/follow';
import { Store } from '@ngrx/store';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
  withLatestFrom,
} from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-about-yourself',
  templateUrl: './about-yourself.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @keyframes slidedown-icon {
          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(20px);
          }

          100% {
            transform: translateY(0);
          }
        }

        .slidedown-icon {
          animation: slidedown-icon;
          animation-duration: 5s;
          animation-iteration-count: infinite;
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    AnimateOnScrollModule,
    //
    FeatSettingsExperienceAddComponent,
    FeatSettingsProfileInformationComponent,
    FeatFollowSuggestionsComponent,
  ],
  animations: [fadeInUpAnimation],
})
export class PageAboutYourselfComponent implements OnInit {
  #router = inject(Router);
  #store = inject(Store);

  #currentProfile = this.#store.select(selectCurrentProfile);
  profileControl = new FormControl<Partial<Profile>>({});

  savedExperience = signal(false);

  constructor() {
    this.#currentProfile
      .pipe(filter(Boolean), take(1), takeUntilDestroyed())
      .subscribe((profile) => {
        this.profileControl.setValue(profile);
      });

    this.profileControl.valueChanges
      .pipe(
        filter(Boolean),
        debounceTime(2000),
        distinctUntilChanged(),
        withLatestFrom(this.#currentProfile),
        takeUntilDestroyed()
      )
      .subscribe(([updatedProfile, currentProfile]) => {
        this.#saveProfileHandler({ ...currentProfile, ...updatedProfile });
      });
  }

  ngOnInit(): void {
    this.#store.dispatch(FeatLegalApiActions.getCompanies());
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  saveExperienceHandler(experience: Experience) {
    this.#store.dispatch(FeatUserApiActions.addExperience({ experience }));
    // this.#router.navigateByUrl('/');
    this.savedExperience.set(true);
  }

  #saveProfileHandler(profile: Partial<Profile>) {
    this.#store.dispatch(
      FeatProfileApiActions.updateProfile({
        profile,
      })
    );
  }
}
