import { Injectable, inject } from "@angular/core";
import { Profile } from "@kitouch/shared/models";
import { AuthService } from "@kitouch/ui/shared";
import { Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ProfileService { 
    #auth = inject(AuthService);

    #functions$ = this.#auth.realmUser$
    .pipe(
        map(user => user?.functions),
        filter(Boolean)
    );

    getFollowingProfiles(following: Array<string>): Observable<Array<Profile>> {
        return this.#functions$
            .pipe(
                switchMap(fns => fns['getProfilesFollowing']({following}))
            )
    }
}