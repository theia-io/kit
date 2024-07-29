import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  FeatLegalApiActions,
  selectCurrentProfile,
} from '@kitouch/kit-data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsProfileInformationComponent,
} from '@kitouch/feat-settings-ui';
import {
  ButtonComponent,
  fadeInUpAnimation,
  NewUIItemComponent,
} from '@kitouch/ui-components';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import { FeatFollowSuggestionsComponent } from '@kitouch/feat-follow-ui';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { take } from 'rxjs/operators';

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
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #actions = inject(Actions);

  currentProfile$ = this.#store.select(selectCurrentProfile).pipe(take(1));
  updatingProfile = signal(false);

  savedExperience = signal(false);

  ngOnInit(): void {
    this.#store.dispatch(FeatLegalApiActions.getCompanies());
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  savingExperienceHandler() {
    this.savedExperience.set(true);
  }
  savedExperienceHandler() {
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  updatingProfileHandler() {
    this.updatingProfile.set(true);

    setTimeout(() => {
      this.updatingProfile.set(false);
    }, 2000);
  }
}
