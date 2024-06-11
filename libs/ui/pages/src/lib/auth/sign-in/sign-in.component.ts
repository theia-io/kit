import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@kitouch/ui/shared';

@Component({
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PageSignInComponent {
  #authService = inject(AuthService);

  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }
}
