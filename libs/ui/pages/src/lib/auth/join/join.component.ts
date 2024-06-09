import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@kitouch/ui/shared';

@Component({
  standalone: true,
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PageJoinComponent {
  #authService = inject(AuthService);

  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }
}
