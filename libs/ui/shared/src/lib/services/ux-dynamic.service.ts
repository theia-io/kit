import { Injectable, signal } from '@angular/core';

const STATIC_MEDIA = 'logo/handshake-s-small.png';
const DYNAMIC_HANDSHAKE_MEDIA = 'logo/handshake.gif';

@Injectable({
  providedIn: 'root',
})
export class UXDynamicService {
  #logoPathTimeoutId?: number;
  logoPath = signal(STATIC_MEDIA);

  updateLogo(logo: 'static' | 'dynamic-handshake', revertTimeout?: number) {
    switch (logo) {
      case 'dynamic-handshake': {
        this.logoPath.set(DYNAMIC_HANDSHAKE_MEDIA);
        if (this.#logoPathTimeoutId) {
          clearTimeout(this.#logoPathTimeoutId);
        }

        this.#logoPathTimeoutId = setTimeout(() => {
          this.logoPath.set(STATIC_MEDIA);
        }, revertTimeout ?? 20_000);

        return;
      }
      case 'static':
      default: {
        this.logoPath.set(STATIC_MEDIA);
        return;
      }
    }
  }
}
