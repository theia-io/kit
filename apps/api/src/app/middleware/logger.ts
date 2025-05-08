import { ConfigService } from '@kitouch/be-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';

export const AppWideLogger =
  (app: NestExpressApplication) =>
  (req: Request, res: Response, next: NextFunction) => {
    const configService = app.get(ConfigService);

    console.info(
      `[AppWideLogger][Request]: ${req.method}, ${req.url}, \n${JSON.stringify(
        req
      )},\nversion: ${configService.getEnvironment(
        'version'
      )}, ${JSON.stringify(configService.getEnvironment())}`
    );

    next();
  };
