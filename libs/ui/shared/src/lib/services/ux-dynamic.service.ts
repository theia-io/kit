import { Injectable, signal } from '@angular/core';

const STATIC_MEDIA = 'logo/handshake-s-small.png';
type LogoMedia = 'static' | 'handshake' | 'hello' | 'ok' | 'done';

@Injectable({
  providedIn: 'root',
})
export class UXDynamicService {
  #logoPathTimeoutId?: number;
  logoPath = signal(STATIC_MEDIA);

  updateLogo(logo: LogoMedia, revertTimeout?: number) {
    switch (logo) {
      case 'done':
      case 'ok':
      case 'hello':
      case 'handshake': {
        this.logoPath.set(`logo/${logo}.gif`);
        this.#revertBack(revertTimeout ?? 10_000);
        return;
      }
      case 'static':
      default: {
        this.logoPath.set(STATIC_MEDIA);
        return;
      }
    }
  }

  #revertBack(revertTimeout: number) {
    if (this.#logoPathTimeoutId) {
      clearTimeout(this.#logoPathTimeoutId);
    }

    this.#logoPathTimeoutId = setTimeout(() => {
      this.logoPath.set(STATIC_MEDIA);
    }, revertTimeout);
  }
}
