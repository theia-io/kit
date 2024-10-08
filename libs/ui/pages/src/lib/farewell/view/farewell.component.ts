import { AsyncPipe, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { FeatFarewellViewComponent } from '@kitouch/feat-farewell-ui';
import { FeatFollowSuggestionByIdComponent } from '@kitouch/follow-ui';
import { profilePicture, selectCurrentProfile } from '@kitouch/kit-data';
import { Farewell, Profile } from '@kitouch/shared-models';
import { APP_PATH, AuthService, UiLogoComponent } from '@kitouch/ui-shared';
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
    UiLogoComponent,
    FeatFarewellViewComponent,
    FeatFollowSuggestionByIdComponent,
  ],
})
export class PageFarewellComponent {
  preview = input(false);

  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #document = inject(DOCUMENT);
  #authService = inject(AuthService);

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    shareReplay()
  );

  farewell = signal<Farewell | undefined>(undefined);
  profile = signal<Profile | undefined>(undefined);
  profilePic = computed(() => profilePicture(this.profile()));

  copied = signal(false);

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

  copyToClipBoard(farewellId: string) {
    navigator.clipboard.writeText(this.#url(farewellId));
    this.copied.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.copied.set(false);
    }, 5000);
  }

  #url(farewellId: string) {
    return [
      this.#document.location.origin,
      APP_PATH.PublicFarewell,
      farewellId,
    ].join('/');
  }
}
