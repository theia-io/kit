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
    auth: string;
    // Helper APIs
    media: string;
    // business logic APIs
    kit: string;
    tweets: string;
    retweets: string;
    bookmarks: string;
    farewells: string;
    farewellComments: string;
    farewellReactions: string;
    farewellAnalytics: string;
    kudoboards: string;
    kudoboardComments: string;
    kudoboardReactions: string;
    kudoboardAnalytics: string;
  };
  googleTagConfig: string | null;
  build: string;
  environment: KIT_ENVS;
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
