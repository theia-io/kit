import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  SignInGoogleComponent,
  slideInOutAnimation,
} from '@kitouch/containers';
import { RouterEventsService } from '@kitouch/shared-infra';
import { TagModule } from 'primeng/tag';
import { take } from 'rxjs';

const ANIMATION_REPEAT = 10000;

@Component({
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    //
    TagModule,
    //
    SignInGoogleComponent,
  ],
  animations: [slideInOutAnimation],
})
export class PageSignInComponent implements OnInit {
  #router = inject(Router);
  #routerEventsService = inject(RouterEventsService);

  kittenVisibleTimeout: NodeJS.Timeout;
  kittenVisible = signal<'in' | 'out'>('out');

  handleGoogleSignIn(signedIn: boolean) {
    if (signedIn) {
      this.#routerEventsService.lastUrlBeforeCancelled$
        .pipe(take(1))
        .subscribe((urlBeforeSignIn) => {
          console.info('[AUTH SERVICE] urlBeforeSignIn:', urlBeforeSignIn);
          this.#router.navigateByUrl(urlBeforeSignIn ?? 'home');
        });
    }
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
