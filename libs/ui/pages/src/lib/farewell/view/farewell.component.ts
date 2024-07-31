import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FeatFarewellActions
} from '@kitouch/feat-farewell-data';
import { FeatFarewellComponent } from '@kitouch/feat-farewell-ui';
import { profilePicture } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { AuthService } from '@kitouch/ui-shared';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './farewell.component.html',
  imports: [
    AsyncPipe,
    ///
    FeatFarewellComponent,
  ],
})
export class PageFarewellComponent implements OnInit {
  #activatedRouter = inject(ActivatedRoute);
  #router = inject(Router);
  #store = inject(Store);
  #authService = inject(AuthService);

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id'])
  );

  profile = signal<Profile | undefined>(undefined);
  profilePic = computed(() => profilePicture(this.profile()));

  ngOnInit(): void {
    this.#store.dispatch(FeatFarewellActions.getFarewells());
  }


  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }
}
