import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FeatAccountApiActions,
  FeatUserApiActions,
  selectAccount,
  selectCurrentProfile,
  selectExperiences,
} from '@kitouch/features/kit/data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsExperienceShowComponent,
  FeatSettingsProfileInformationComponent,
} from '@kitouch/features/settings/ui';
import { Experience } from '@kitouch/shared/models';
import { NewUIItemComponent } from '@kitouch/ui/components';
import { FeatFollowActions } from '@kitouch/ui/features/follow/data';
import { select, Store } from '@ngrx/store';
import { AccordionModule } from 'primeng/accordion';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { take } from 'rxjs';

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
    FeatSettingsExperienceAddComponent,
    FeatSettingsExperienceShowComponent,
  ],
})
export class PageSettingsComponent {
  #store = inject(Store);

  currentProfile$ = this.#store.select(selectCurrentProfile).pipe(take(1));
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

  experiences$ = this.#store.pipe(select(selectExperiences));

  experienceMessage: Message = {
    severity: 'contrast',
    detail: 'Experience section.',
  };

  currentAccount = toSignal(this.#store.select(selectAccount));
  dangerZoneMessage: Message = {
    severity: 'warn',
    detail: 'Danger Zone area. Actions here can lead to unexpected results',
  };

  updatingProfileHandler() {
    console.log('updatingProfileHandler');
    this.updatingProfile.set(true);

    setTimeout(() => {
      this.updatingProfile.set(false);
    }, 3000);
  }

  deleteTweetHandler(experience: Experience) {
    this.#store.dispatch(FeatUserApiActions.deleteExperience({ experience }));
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

  savedExperienceHandler() {
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }

  editHandler(experience: Experience){
    console.log(experience);
   }
}
