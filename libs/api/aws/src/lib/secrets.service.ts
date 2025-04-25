import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AWSSecretsService {
  client = new SecretsManagerClient({
    region: 'eu-north-1',
  });

  constructor() {
    console.log(
      'AWSSecretsService constructor, time: %s',
      new Date().toUTCString()
    );
  }

  async getSecrets() {
    console.log('AWSSecretsService getSecrets');
    let response;

    // eslint-disable-next-line no-useless-catch
    try {
      response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: 'kit-api-secrets-dev',
          VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
    } catch (error) {
      console.error('getSecrets error', error);
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }

    const secretString = response.SecretString;
    console.log('secretString %s, %s', secretString, response);

    // const [clientSecret, authSecret, jwtSecret, sessionSecret, atlasUri] =
    //   secretString?.split(',') ?? [];

    // let response1;
    // // eslint-disable-next-line no-useless-catch
    // try {
    //   response1 = await this.client.send(
    //     new GetSecretValueCommand({
    //       SecretId: 'env-kit-api-secrets-dev',
    //     })
    //   );
    // } catch (error) {
    //   console.error('getSecrets error 1', error);
    //   // For a list of exceptions thrown, see
    //   // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    //   throw error;
    // }
    // console.log('secretString1', response1.SecretString, response1);

    return {
      // clientSecret,
      // authSecret,
      // jwtSecret,
      // sessionSecret,
      // atlasUri,
    };
  }
}
