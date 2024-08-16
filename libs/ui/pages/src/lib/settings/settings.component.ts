import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsExperienceShowComponent,
  FeatSettingsProfileInformationComponent,
  FeatSettingsSocialsComponent,
} from '@kitouch/feat-settings-ui';
import {
  FeatAccountApiActions,
  FeatLegalApiActions,
  FeatUserApiActions,
  selectAccount,
  selectCurrentProfile,
  selectCurrentUserExperiences,
} from '@kitouch/kit-data';
import { Experience } from '@kitouch/shared-models';
import { NewUIItemComponent } from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { AccordionModule } from 'primeng/accordion';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { filter, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    //
    MessagesModule,
    AccordionModule,
    ButtonModule,
    //
    NewUIItemComponent,
    FeatSettingsProfileInformationComponent,
    FeatSettingsSocialsComponent,
    FeatSettingsExperienceAddComponent,
    FeatSettingsExperienceShowComponent,
  ],
})
export class PageSettingsComponent implements OnInit {
  #store = inject(Store);

  currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean), take(1));

  updatingProfile = signal(false);
  profileMessage = computed<Message>(() => {
    if (this.updatingProfile()) {
      return { severity: 'success', detail: 'Saving updated profile' };
    } else {
      return {
        severity: 'info',
        detail: 'Edit your information and we will save it automatically',
      };
    }
  });

  updatingSocials = signal(false);
  socialsMessage = computed<Message>(() => {
    if (this.updatingSocials()) {
      return { severity: 'success', detail: 'Saving your social networks' };
    } else {
      return {
        severity: 'info',
        detail: 'Add your social networks and we will save them automatically',
      };
    }
  });

  experiences$ = this.#store.pipe(select(selectCurrentUserExperiences));

  experienceMessage: Message = {
    severity: 'contrast',
    detail: 'Experience section',
  };

  currentAccount = toSignal(this.#store.select(selectAccount));
  dangerZoneMessage: Message = {
    severity: 'warn',
    detail: 'Danger Zone area. Actions here can lead to unexpected results',
  };

  ngOnInit(): void {
    this.#store.dispatch(FeatLegalApiActions.getCompanies());
  }

  updatingProfileHandler() {
    this.updatingProfile.set(true);

    setTimeout(() => {
      this.updatingProfile.set(false);
    }, 3000);
  }

  updatingSocialsHandler() {
    this.updatingSocials.set(true);

    setTimeout(() => {
      this.updatingSocials.set(false);
    }, 3000);
  }

  editExperienceHandler(experience: Experience) {
    console.log(experience);
  }

  deleteExperienceHandler(experience: Experience) {
    this.#store.dispatch(FeatUserApiActions.deleteExperience({ experience }));
  }

  savedExperienceHandler() {
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  deleteAccountHandler() {
    const currentAccount = this.currentAccount();
    console.log(currentAccount);
    if (currentAccount) {
      this.#store.dispatch(
        FeatAccountApiActions.delete({ account: currentAccount })
      );
    }
  }
}
