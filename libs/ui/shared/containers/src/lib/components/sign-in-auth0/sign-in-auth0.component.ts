import { FeatAuth0Events } from '@kitouch/kit-data';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Optional,
  output,
} from '@angular/core';
import { Auth0Service } from '@kitouch/shared-infra';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  standalone: true,
  selector: 'shared-sign-in-auth0',
  templateUrl: './sign-in-auth0.component.html',
  imports: [ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInAuth0Component {
  #auth0Service = inject(Auth0Service);
  #store = inject(Store);

  signedIn = output<boolean>();

  // When SignInGoogleComponent opened as dynamic dialog it Dialog will expect close event. However component is also used in other places not as dynamic dialog thus dynamicDialogRef will not be provided (is not expected)
  constructor(@Optional() dynamicDialogRef: DynamicDialogRef) {
    if (dynamicDialogRef) {
      this.signedIn.subscribe((data) => {
        dynamicDialogRef.close(data);
      });
    }
  }

  refresh() {
    console.log('');
    this.#store.dispatch(FeatAuth0Events.handleRedirect());
  }

  handleSignIn() {
    this.#auth0Service.signIn();
    // .subscribe(v => console.log('v',v))
  }
}
