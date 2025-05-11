import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions } from '@ngrx/effects';
import {
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
  take,
  tap,
} from 'rxjs';

export enum ObjectLoadingState {
  NotStarted = 'NotStarted',
  Loading = 'loading',
  Loaded = 'loaded',
  LoadingError = 'loading-error',
}

const DEFAULT_STATE = {
  state: ObjectLoadingState.NotStarted,
  loading: false,
  loaded: false,
  loadError: false,
};

export const objectLoadingState$ = <T extends { id?: string }>({
  //   data$,
  loadingAction$,
  loadedAction$,
  loadingErrorAction$,
}: {
  //   data$: () => Observable<T | null>;
  loadingAction$: (actions$: Actions<any>) => Observable<T>;
  loadedAction$: (actions$: Actions<any>) => Observable<T>;
  loadingErrorAction$: (actions$: Actions<any>) => Observable<T>;
}) => {
  const actions$ = inject(Actions);

  let loadingId: T['id'] | null = null;

  return merge(
    loadingAction$(actions$).pipe(
      tap(({ id }) => (loadingId = id)),
      take(1),
      map(() => ({
        ...DEFAULT_STATE,
        state: ObjectLoadingState.Loading,
        loading: true,
      })),
    ),
    loadedAction$(actions$).pipe(
      filter(({ id }) => (loadingId && id ? loadingId === id : true)),
      take(1),
      map(() => ({
        ...DEFAULT_STATE,
        state: ObjectLoadingState.Loaded,
        loaded: true,
      })),
    ),
    loadingErrorAction$(actions$).pipe(
      filter(({ id }) => (loadingId && id ? loadingId === id : true)),
      take(1),
      map(() => ({
        ...DEFAULT_STATE,
        state: ObjectLoadingState.LoadingError,
        loadError: true,
      })),
    ),
  ).pipe(
    takeUntilDestroyed(), // to make sure this is used in injection context (usually class creation)
    startWith(DEFAULT_STATE),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    }),
  );
};
