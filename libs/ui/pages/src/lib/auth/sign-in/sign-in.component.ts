import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SignInAuth0Component, slideInOutAnimation } from '@kitouch/containers';
import { FeatFarewellIntoComponent } from '@kitouch/feat-farewell-ui';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { DeviceService, RouterEventsService } from '@kitouch/shared-infra';
import { UiCompGradientCardComponent } from '@kitouch/ui-components';
import { FeatKudoBoardIntoComponent } from '@kitouch/ui-kudoboard';
import { TagModule } from 'primeng/tag';
import { startWith } from 'rxjs';

const ANIMATION_REPEAT = 10000;

@Component({
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    AsyncPipe,
    //
    TagModule,
    //
    SignInAuth0Component,
    UiCompGradientCardComponent,
    FeatFarewellIntoComponent,
    FeatKudoBoardIntoComponent,
  ],
  animations: [slideInOutAnimation],
})
export class PageSignInComponent implements OnInit {
  #router = inject(Router);
  #routerEventsService = inject(RouterEventsService);

  hintHidden$ = inject(DeviceService).isMobile$.pipe(startWith(true));

  kittenVisibleTimeout: NodeJS.Timeout;
  kittenVisible = signal<'in' | 'out'>('out');

  clickedIntro = signal<null | 'kudo' | 'farewell'>(null);

  readonly introducingKitFarewell = `/s/${APP_PATH_STATIC_PAGES.IntroduceKit}`;

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
