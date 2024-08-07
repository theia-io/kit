import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsExperienceShowComponent,
  FeatSettingsProfileInformationComponent,
} from '@kitouch/feat-settings-ui';
import { FeatUserApiActions, selectExperiences } from '@kitouch/kit-data';
import { Experience } from '@kitouch/shared-models';
import { NewUIItemComponent } from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

@Component({
  standalone: true,
  selector: 'kit-page-profile-experience',
  templateUrl: './experience.component.html',
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
    //
  ],
})
export class PageProfileExperienceComponent {
  #store = inject(Store);
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  experiences$ = this.#store.pipe(select(selectExperiences));

  deleteExperienceHandler(experience: Experience) {
    this.#store.dispatch(FeatUserApiActions.deleteExperience({ experience }));
  }

  savedExperienceHandler() {
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }
}
