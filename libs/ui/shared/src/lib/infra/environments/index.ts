import { InjectionToken } from '@angular/core';

export interface Environment {
  development: boolean; // when true then DEV env
  production: boolean; // when true then PRD env; does not matter if development is `true`
  realmAppId: string; // Realm Web App ID
}

/**
 * @const ENVIRONMENT
 * Injection token for the environment interface to be provided by the applications.
 */
export const ENVIRONMENT: InjectionToken<Environment> = new InjectionToken(
  'ENVIRONMENT'
);
