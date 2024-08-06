import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { profilePicture, selectProfileById } from '@kitouch/kit-data';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { filter, map, shareReplay, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterModule,
    //
    TabMenuModule,
    //
  ],
})
export class PageProfileComponent {
  #store = inject(Store);
  #activatedRouter = inject(ActivatedRoute);

  #profileIdOrAlias$ = this.#activatedRouter.params.pipe(
    map((params) => params['profileIdOrAlias'])
  );

  #profile$ = this.#profileIdOrAlias$.pipe(
    switchMap((profileIdOrAlias) =>
      this.#store.select(selectProfileById(profileIdOrAlias))
    ),
    filter(Boolean),
    shareReplay(1)
  );

  profile = toSignal(this.#profile$);
  profilePic = computed(() => profilePicture(this.profile() ?? {}));

  items: MenuItem[] = [
    { label: 'Tweets', icon: 'pi pi-inbox', routerLink: 'tweets' },
    { label: 'Experience', icon: 'pi pi-briefcase', routerLink: 'experience' },
  ];
}
