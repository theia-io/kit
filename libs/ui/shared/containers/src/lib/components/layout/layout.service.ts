import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeviceMediaBreakpoint, DeviceService } from '@kitouch/shared-infra';
import { map, shareReplay } from 'rxjs';

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

  mobileNavbar$ = inject(DeviceService).mediaBreakpoint$.pipe(
    map((breakpoint) => breakpoint === DeviceMediaBreakpoint.xs),
    shareReplay(1),
    takeUntilDestroyed()
  );
}
