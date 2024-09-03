import { Injectable, signal } from '@angular/core';

enum PanelState {
  Opened = 'opened',
  UserOpened = 'user-opened',
  Closed = 'closed',
  UserClosed = 'user-closed',
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  rightPanelState = signal<PanelState>(PanelState.Opened);
}
