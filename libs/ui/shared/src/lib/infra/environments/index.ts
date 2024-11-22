import { InjectionToken } from '@angular/core';
import { S3Config } from '../data/s3.service';

export enum KIT_ENVS {
  localhost = 'localhost',
  development = 'development',
  production = 'production',
}

export interface Environment {
  api: {
    root: string;
    media: string;
  };
  googleTagConfig: string | null;
  build: string;
  environment: KIT_ENVS; // when true then DEV env
  production: boolean; // when true then PRD env; does not matter if development is `true`
  realmAppId: string; // Realm Web App ID
  // S3
  s3Config: S3Config;
}

/**
 * @const ENVIRONMENT
 * Injection token for the environment interface to be provided by the applications.
 */
export const ENVIRONMENT: InjectionToken<Environment> = new InjectionToken(
  'ENVIRONMENT'
);
