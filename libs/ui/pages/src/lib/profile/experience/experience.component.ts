import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import {
  FeatSettingsExperienceAddComponent,
  FeatSettingsExperienceShowComponent,
  FeatSettingsProfileInformationComponent,
} from '@kitouch/feat-settings-ui';
import {
  FeatLegalApiActions,
  FeatUserApiActions,
  selectCurrentProfile,
  selectCurrentUserExperiences,
  selectProfileById,
  selectUserExperience,
} from '@kitouch/kit-data';
import { Experience } from '@kitouch/shared-models';
import { NewUIItemComponent } from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import {
  combineLatest,
  filter,
  map,
  shareReplay,
  switchMap,
  throwError,
  withLatestFrom,
} from 'rxjs';

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
  #activatedRouter = inject(ActivatedRoute);

  #profileIdOrAlias$ = this.#activatedRouter.parent?.params.pipe(
    map((params) => params['profileIdOrAlias'])
  );

  #profile$ = this.#profileIdOrAlias$
    ? this.#profileIdOrAlias$.pipe(
        switchMap((profileIdOrAlias) =>
          this.#store.select(selectProfileById(profileIdOrAlias))
        ),
        filter(Boolean),
        shareReplay(1)
      )
    : throwError(
        () =>
          'Cannot continue without profile id. likely component is user incorrectly'
      );

  profile = toSignal(this.#profile$);

  currentProfile = toSignal(
    this.#store.pipe(select(selectCurrentProfile), filter(Boolean))
  );

  isCurrentProfile = computed(
    () => this.profile()?.id === this.currentProfile()?.id
  );
  experiences = computed(() => {
    if (this.isCurrentProfile()) {
      return this.#store.selectSignal(selectCurrentUserExperiences)();
    }
    const openedProfile = this.profile();
    if (openedProfile) {
      return this.#store.selectSignal(selectUserExperience(openedProfile.id))();
    }

    return [];
  });

  constructor() {
    this.#profile$
      .pipe(
        takeUntilDestroyed(),
        map(({ userId }) => userId),
        filter(Boolean)
      )
      .subscribe((userId) =>
        this.#store.dispatch(FeatUserApiActions.getUser({ userId }))
      );

    toObservable(this.isCurrentProfile)
      .pipe(takeUntilDestroyed(), filter(Boolean))
      .subscribe(() =>
        this.#store.dispatch(FeatLegalApiActions.getCompanies())
      );
    // @TODO Figure out why bottom's `store.dispatch`  returns error
    // effect(() => {
    //   const profile = this.profile();
    //   if (profile && profile.userId) {
    //     this.#store.dispatch(
    //       FeatUserApiActions.getUser({ userId: profile.userId })
    //     );
    //   }
    // });
  }

  deleteExperienceHandler(experience: Experience) {
    this.#store.dispatch(FeatUserApiActions.deleteExperience({ experience }));
  }

  savedExperienceHandler() {
    this.#store.dispatch(FeatFollowActions.getSuggestionColleaguesToFollow());
  }
}