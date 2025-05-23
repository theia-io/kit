import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Optional,
  output,
} from '@angular/core';
import { Auth0Service } from '@kitouch/shared-infra';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  standalone: true,
  selector: 'shared-sign-in-auth0',
  templateUrl: './sign-in-auth0.component.html',
  imports: [UIKitSmallerHintTextUXDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInAuth0Component {
  #auth0Service = inject(Auth0Service);

  signedIn = output<boolean>();

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      color: 'text-white',
      size: 'text-xl',
      hoverColor: 'text-slate-700',
    },
  };

  // When SignInGoogleComponent opened as dynamic dialog it Dialog will expect close event. However component is also used in other places not as dynamic dialog thus dynamicDialogRef will not be provided (is not expected)
  constructor(@Optional() private dynamicDialogRef: DynamicDialogRef) {
    if (dynamicDialogRef) {
      this.signedIn.subscribe((data) => {
        dynamicDialogRef.close(data);
      });
    }
  }

  handleSignIn() {
    if (this.dynamicDialogRef) {
      this.#auth0Service
        .signInTab()
        .then(() => {
          this.signedIn.emit(true);
        })
        .catch(() => this.signedIn.emit(false));
    } else {
      this.#auth0Service.signIn();
    }
  }
}
