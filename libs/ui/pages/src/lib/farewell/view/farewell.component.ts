import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { FeatFarewellViewComponent } from '@kitouch/feat-farewell-ui';
import { FeatFollowSuggestionByIdComponent } from '@kitouch/follow-ui';
import { profilePicture, selectCurrentProfile } from '@kitouch/kit-data';
import { Farewell, Profile } from '@kitouch/shared-models';
import { AuthService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { distinctUntilChanged, map, shareReplay } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './farewell.component.html',
  imports: [
    AsyncPipe,
    RouterModule,
    NgOptimizedImage,
    ///
    ButtonModule,
    TagModule,
    ///
    FeatFarewellViewComponent,
    FeatFollowSuggestionByIdComponent,
  ],
})
export class PageFarewellComponent {
  preview = input(false);

  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #authService = inject(AuthService);

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    shareReplay()
  );

  farewell = signal<Farewell | undefined>(undefined);
  profile = signal<Profile | undefined>(undefined);
  profilePic = computed(() => profilePicture(this.profile()));

  currentKitProfile$ = this.#store.pipe(select(selectCurrentProfile));

  constructor() {
    this.farewellId$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((id) =>
        this.#store.dispatch(FeatFarewellActions.getFarewell({ id }))
      );
  }

  copyUrlHandler() {}

  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }
}
