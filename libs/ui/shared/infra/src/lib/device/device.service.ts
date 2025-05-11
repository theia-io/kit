import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  filter,
  fromEvent,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';

export enum DeviceMediaBreakpoint {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}
export enum Device {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}
export const breakPointToDevice: { [key in DeviceMediaBreakpoint]: Device } = {
  [DeviceMediaBreakpoint.xs]: Device.Mobile,
  [DeviceMediaBreakpoint.sm]: Device.Mobile,
  [DeviceMediaBreakpoint.md]: Device.Tablet,
  [DeviceMediaBreakpoint.lg]: Device.Desktop,
  [DeviceMediaBreakpoint.xl]: Device.Desktop,
  [DeviceMediaBreakpoint.xxl]: Device.Desktop,
};

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  innerWidth$: Observable<number> = fromEvent(window, 'resize').pipe(
    takeUntilDestroyed(),
    debounceTime(1000),
    map(({ target: { innerWidth } }: any) => innerWidth),
    startWith(window.innerWidth),
    shareReplay(1),
  );

  mediaBreakpoint$ = this.innerWidth$.pipe(
    map((width) => {
      if (width < 640) {
        return DeviceMediaBreakpoint.xs;
      } else if (width >= 640 && width < 768) {
        return DeviceMediaBreakpoint.sm;
      } else if (width >= 768 && width < 992) {
        return DeviceMediaBreakpoint.md;
      } else if (width >= 992 && width < 1200) {
        return DeviceMediaBreakpoint.lg;
      } else if (width >= 1200 && width < 1600) {
        return DeviceMediaBreakpoint.xl;
      } else {
        return DeviceMediaBreakpoint.xxl;
      }
    }),
    shareReplay(1),
  );

  device$ = this.mediaBreakpoint$.pipe(
    takeUntilDestroyed(),
    filter(Boolean),
    map((mediaBreakPoint) => breakPointToDevice[mediaBreakPoint]),
    shareReplay(1),
  );

  isMobile$ = this.device$.pipe(map((device) => device === Device.Mobile));

  constructor() {
    this.innerWidth$.subscribe();
  }
}
