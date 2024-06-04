import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@kitouch/ui/shared';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinComponent {
  #authService = inject(AuthService);

  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }
}
