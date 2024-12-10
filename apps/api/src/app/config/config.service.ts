import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigOptionsToken, EnvConfig } from './type';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(configOptionsToken: ConfigOptionsToken) {
    console.log(
      'configOptionsToken',
      configOptionsToken,
      process.cwd(),
      __dirname
    );

    const options = { ...configOptionsToken, folder: './config' };

    const filePath = `.env${process.env.NODE_ENV || '.development'}`;
    console.log('filePath', filePath);
    const envFile = path.resolve(process.cwd(), options.folder, filePath);
    console.log('envFile', envFile);
    this.envConfig = dotenv.parse(
      fs.readFileSync(envFile)
    ) as unknown as EnvConfig;
    console.log('envConfig', this.envConfig);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
