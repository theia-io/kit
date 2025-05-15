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

  async getSecrets() {
    console.info('[AWSSecretsService] AWSSecretsService getSecrets');
    let response;

    // eslint-disable-next-line no-useless-catch
    try {
      response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: 'kit-api-secrets-dev',
          VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        }),
      );
    } catch (error) {
      console.error('[AWSSecretsService] getSecrets error', error);
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      return null;
    }

    const secretString = response.SecretString;

    console.info(
      '[AWSSecretsService] success! @TODO @Danylo check me: \nObject:\n%s, \nString: \n%s',
      JSON.stringify(response),
      secretString,
    );

    const { 'kit-api-secrets-dev': kitApiSecrets } = JSON.parse(
      secretString ?? '{}',
    );

    console.log('[AWSSecretsService] kitApiSecrets', kitApiSecrets);

    // const secretString = response.SecretString;
    // console.info('[AWSSecretsService] secretString %s, %s', secretString, response);

    return {
      // clientSecret,
      // authSecret,
      // jwtSecret,
      // sessionSecret,
      // atlasUri,
    };
  }
}
