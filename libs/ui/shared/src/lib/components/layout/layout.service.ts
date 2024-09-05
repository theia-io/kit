import { computed, Injectable, signal } from '@angular/core';

export enum PanelState {
  Opened = 'opened',
  UserOpened = 'user-opened',
  Closed = 'closed',
  UserClosed = 'user-closed',
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  rightPanelState = signal<PanelState>(PanelState.Opened);

  rightPanelClosed = computed(
    () =>
      this.rightPanelState() === PanelState.Closed ||
      this.rightPanelState() === PanelState.UserClosed
  );
}
