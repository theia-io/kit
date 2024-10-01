import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService, slideInOutAnimation } from '@kitouch/ui-shared';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

const ANIMATION_REPEAT = 10000;

@Component({
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    //
    ButtonModule,
    TagModule,
    //
  ],
  animations: [slideInOutAnimation],
})
export class PageSignInComponent implements OnInit {
  #authService = inject(AuthService);

  kittenVisibleTimeout: NodeJS.Timeout;
  kittenVisible = signal<'in' | 'out'>('out');

  handleGoogleSignIn() {
    this.#authService.googleSignIn();
  }

  ngOnInit(): void {
    this.#animateKitten();
  }

  focusHandler() {
    clearTimeout(this.kittenVisibleTimeout);
    this.kittenVisible.set('in');
  }

  blurHandler() {
    clearTimeout(this.kittenVisibleTimeout);
    this.#animateKitten();
  }

  #animateKitten() {
    const salt = Math.random() + 0.5;
    const visible = this.kittenVisible() === 'in';
    this.kittenVisibleTimeout = setTimeout(
      () => {
        this.kittenVisible.set(visible ? 'out' : 'in');
        this.#animateKitten();
      },
      !visible ? salt * ANIMATION_REPEAT * 2 : salt * ANIMATION_REPEAT
    );
  }
}
