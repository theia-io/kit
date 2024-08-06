import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { FeatFarewellComponent } from '@kitouch/feat-farewell-ui';
import { FeatFollowSuggestionByIdComponent } from '@kitouch/follow-ui';
import { profilePicture, selectCurrentProfile } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { AuthService } from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { TagModule } from 'primeng/tag';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './farewell.component.html',
  imports: [
    AsyncPipe,
    RouterModule,
    NgOptimizedImage,
    ///
    TagModule,
    ///
    FeatFarewellComponent,
    FeatFollowSuggestionByIdComponent,
  ],
})
export class PageFarewellComponent {
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #authService = inject(AuthService);

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    shareReplay(),
    tap((v) => console.log(v))
  );

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

  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }
}
