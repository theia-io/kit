import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Optional,
  output,
} from '@angular/core';
import { AuthService } from '@kitouch/shared-infra';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  standalone: true,
  selector: 'shared-sign-in-google',
  templateUrl: './sign-in-google.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInGoogleComponent {
  #authService = inject(AuthService);

  signedIn = output<boolean>();

  // When SignInGoogleComponent opened as dynamic dialog it Dialog will expect close event. However component is also used in other places not as dynamic dialog thus dynamicDialogRef will not be provided (is not expected)
  constructor(@Optional() dynamicDialogRef: DynamicDialogRef) {
    if (dynamicDialogRef) {
      this.signedIn.subscribe((data) => {
        dynamicDialogRef.close(data);
      });
    }
  }

  handleGoogleSignIn() {
    this.#authService
      .googleSignIn()
      .then(() => this.signedIn.emit(true))
      .catch(() => this.signedIn.emit(false));
  }
}
