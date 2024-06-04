import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient } from '@angular/common/http';

const realAppFactory = () => {
return () => Promise.resolve();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withDebugTracing()),
    provideAnimationsAsync(),

    // auth 
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: realAppFactory,
      multi: true,
      deps: [HttpClient],
    },
  ],
};
