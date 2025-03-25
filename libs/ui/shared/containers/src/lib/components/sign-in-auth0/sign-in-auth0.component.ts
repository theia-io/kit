import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Optional,
  output,
} from '@angular/core';
import { Auth0Service } from '@kitouch/shared-infra';
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
  #authService = inject(Auth0Service);

  signedIn = output<boolean>();

  // When SignInGoogleComponent opened as dynamic dialog it Dialog will expect close event. However component is also used in other places not as dynamic dialog thus dynamicDialogRef will not be provided (is not expected)
  constructor(@Optional() dynamicDialogRef: DynamicDialogRef) {
    if (dynamicDialogRef) {
      this.signedIn.subscribe((data) => {
        dynamicDialogRef.close(data);
      });
    }
  }

  handleSignIn() {
    this.#authService.signIn();
    // .subscribe(v => console.log('v',v))
  }
}
