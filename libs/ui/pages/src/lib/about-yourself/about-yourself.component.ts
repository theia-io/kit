import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SharedKitUserHintDirective } from '@kitouch/containers';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsProfileInformationComponent,
} from '@kitouch/feat-settings-ui';
import { FeatFollowSuggestionsComponent } from '@kitouch/follow-ui';
import { FeatLegalApiActions, selectCurrentProfile } from '@kitouch/kit-data';
import { TutorialService } from '@kitouch/shared-services';
import {
  ButtonComponent,
  fadeInUpAnimation,
  UiKitCompAnimatePingComponent,
} from '@kitouch/ui-components';

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
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    //
    AnimateOnScrollModule,
    //
    UiKitCompAnimatePingComponent,
    FeatSettingsExperienceAddComponent,
    FeatSettingsProfileInformationComponent,
    FeatFollowSuggestionsComponent,
    ButtonComponent,
    SharedKitUserHintDirective,
  ],
  animations: [fadeInUpAnimation],
})
export class PageAboutYourselfComponent implements OnInit {
  #store = inject(Store);
  #tutorial = inject(TutorialService);

  currentProfile$ = this.#store.select(selectCurrentProfile).pipe(take(1));
  updatingProfile = signal(false);

  savedExperience = signal(false);

  ngOnInit(): void {
    this.#store.dispatch(FeatLegalApiActions.getCompanies());
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());

    this.#tutorial.showAboutUsPageTourIfNotShown();
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
