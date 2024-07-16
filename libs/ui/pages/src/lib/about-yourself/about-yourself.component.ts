import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import {
  ButtonComponent,
  fadeInUpAnimation,
  NewUIItemComponent,
} from '@kitouch/ui/components';
import { FeatFollowActions } from '@kitouch/ui/features/follow/data';
import { FeatFollowSuggestionsComponent } from '@kitouch/ui/features/follow/ui';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
  takeUntil,
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
    RouterLink,
    ReactiveFormsModule,
    //
    AnimateOnScrollModule,
    //
    NewUIItemComponent,
    FeatSettingsExperienceAddComponent,
    FeatSettingsProfileInformationComponent,
    FeatFollowSuggestionsComponent,
    ButtonComponent,
  ],
  animations: [fadeInUpAnimation],
})
export class PageAboutYourselfComponent implements OnInit {
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #actions = inject(Actions);

  #currentProfile = this.#store.select(selectCurrentProfile);
  profileControl = new FormControl<Partial<Profile>>({});
  updatingProfile = signal(false);

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
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  saveExperienceHandler(experience: Experience) {
    this.savedExperience.set(true);
    this.#actions
      .pipe(
        ofType(FeatUserApiActions.addExperienceSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() =>
        this.#store.dispatch(
          FeatFollowActions.getSuggestionColleaguesToFollow()
        )
      );
    this.#store.dispatch(FeatUserApiActions.addExperience({ experience }));
  }

  #saveProfileHandler(profile: Partial<Profile>) {
    this.updatingProfile.set(true);
    this.#store.dispatch(
      FeatProfileApiActions.updateProfile({
        profile,
      })
    );

    setTimeout(() => {
      this.updatingProfile.set(false);
    }, 2000);
  }
}
