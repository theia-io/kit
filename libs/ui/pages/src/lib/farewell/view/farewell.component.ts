import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FeatFarewellActions
} from '@kitouch/feat-farewell-data';
import { FeatFarewellComponent } from '@kitouch/feat-farewell-ui';
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

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id'])
  );

  ngOnInit(): void {
    this.#store.dispatch(FeatFarewellActions.getFarewells());
  }
}
