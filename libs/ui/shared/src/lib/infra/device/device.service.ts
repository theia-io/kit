import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  fromEvent,
  map,
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
  mediaBreakpoint$ = new BehaviorSubject<DeviceMediaBreakpoint | undefined>(
    undefined
  );

  device$ = this.mediaBreakpoint$.asObservable().pipe(
    takeUntilDestroyed(),
    filter(Boolean),
    map((mediaBreakPoint) => breakPointToDevice[mediaBreakPoint]),
    shareReplay(1)
  );

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        debounceTime(1000),
        map(({ target: { innerWidth } }: any) => innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe((width) => {
        if (width < 576) {
          this.mediaBreakpoint$.next(DeviceMediaBreakpoint.xs);
        } else if (width >= 576 && width < 768) {
          this.mediaBreakpoint$.next(DeviceMediaBreakpoint.sm);
        } else if (width >= 768 && width < 992) {
          this.mediaBreakpoint$.next(DeviceMediaBreakpoint.md);
        } else if (width >= 992 && width < 1200) {
          this.mediaBreakpoint$.next(DeviceMediaBreakpoint.lg);
        } else if (width >= 1200 && width < 1600) {
          this.mediaBreakpoint$.next(DeviceMediaBreakpoint.xl);
        } else {
          this.mediaBreakpoint$.next(DeviceMediaBreakpoint.xxl);
        }
      });
  }
}
