import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@kitouch/shared-infra';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SignInGoogleComponent } from '../components/sign-in-google/sign-in-google.component';

@Directive({
  standalone: true,
  selector: '[sharedAuthorizedFeature]',
  providers: [DialogService],
})
export class AuthorizedFeatureDirective implements AfterViewInit, OnDestroy {
  #authService = inject(AuthService);
  dialogService = inject(DialogService);
  dialogRef: DynamicDialogRef | undefined;
  #elRef = inject(ElementRef);

  loggedIn = toSignal(this.#authService.loggedInWithRealmUser$, {
    initialValue: false,
  });

  // Switch to @HostListener once useCapture
  // (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture)
  // is available in Angular
  // (https://github.com/angular/angular/issues/11200)
  ngAfterViewInit(): void {
    this.#elRef.nativeElement.addEventListener(
      'click',
      (event: PointerEvent) => this.#handleClick(event),
      { capture: true }
    );
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef.destroy();
    }
  }

  #handleClick(event: PointerEvent) {
    if (!this.loggedIn()) {
      event.stopPropagation();
      event.preventDefault();

      this.dialogRef = this.dialogService.open(SignInGoogleComponent, {
        header: 'Instant sign-in / register 🫡',
        modal: true,
        draggable: false,
        dismissableMask: true,
        focusOnShow: false,
      });

      this.dialogRef.onClose.subscribe((loggedIn) => {
        if (loggedIn) {
          setTimeout(() => this.#replayEvent(event));
        }
      });

      return;
    }
  }

  #replayEvent(event: PointerEvent) {
    if (event.target) {
      const newEvent = new MouseEvent('click', {
        // Create a new click event
        bubbles: true, // Allow it to bubble
        cancelable: true,
      });

      event.target.dispatchEvent(newEvent); // Dispatch the new event on the same target
    }
  }
}
