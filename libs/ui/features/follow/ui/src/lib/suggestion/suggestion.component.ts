import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { selectProfileById } from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { select, Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-follow-suggest-profile-by-id',
  templateUrl: './suggestion.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFollowSuggestionByIdComponent {
  profileId = input.required<Profile['id']>();

  #store = inject(Store);

  profileId$ = toObservable(this.profileId);
  profileToSuggest$ = this.profileId$.pipe(
    switchMap((profileId) =>
      this.#store.pipe(select(selectProfileById(profileId)))
    )
  );
}
