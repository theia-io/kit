import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Config, Environment, EnvironmentToken } from './type';

@Injectable()
export class ConfigService {
  #environment: Environment;
  #config: Config;

  constructor(@Inject(EnvironmentToken) environment: Environment) {
    this.#environment = environment;

    if (!environment.production) {
      dotenv.config({
        path: path.resolve(process.cwd(), 'config/', '.env.local'),
      });

      console.log(
        'resolved env',
        path.resolve(process.cwd(), 'config/', '.env.local')
      );
    }

    const sessionSecret = process.env['SESSION_SECRET'],
      jwtSecret = process.env['JWT_SECRET'],
      authSecret = process.env['AUTH0_SECRET'],
      clientSecret = process.env['AUTH0_CLIENT_SECRET'],
      clientId = process.env['AUTH0_CLIENT_ID'],
      issuerBaseUrl = process.env['AUTH0_ISSUER'];

    if (
      !sessionSecret ||
      !jwtSecret ||
      !authSecret ||
      !clientSecret ||
      !clientId ||
      !issuerBaseUrl
    ) {
      console.error('missing env variable(s)');
      process.exit(1);
    }

    const atlasUri = process.env['ATLAS_URI'];
    if (!atlasUri) {
      console.error('missing DB connection string');
      process.exit(1);
    }

    this.#config = {
      atlasUri,
      s3: {
        region: process.env?.['S3_REGION'] ?? 'eu-north-1',
        identityPoolId:
          process.env?.['S3_IDENTITY_POOL_ID'] ??
          'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
        profileBucket:
          process.env?.['S3_BUCKET_PROFILE'] ?? 'kitouch-public-profiles',
        farewellBucket:
          process.env?.['S3_BUCKET_FAREWELL'] ?? 'kitouch-public-farewell',
        kudoBoardBucket:
          process.env?.['S3_BUCKET_KUDOBOARD'] ?? 'kitouch-public-kudoboard',
      },
      auth: {
        issuerBaseUrl,
        clientId,
        clientSecret,
        authSecret,
        jwtSecret,
        sessionSecret,
      },
    };

    if (!environment.production) {
      console.log('\nenvironment:\n', JSON.stringify(this.#environment));
      console.log(
        '\nconfig:\n',
        JSON.stringify(this.#config.s3),
        '\n',
        JSON.stringify(this.#config.auth)
      );
    }
  }

  getEnvironment<T extends keyof Environment>(key: T): Environment[T];
  getEnvironment(): Environment;
  getEnvironment<T extends keyof Environment>(
    key?: T
  ): Environment[T] | Environment {
    if (!key) {
      return this.#environment;
    }

    return this.#environment[key];
  }

  getConfig<T extends keyof Config>(key: T) {
    return this.#config[key];
  }
}
