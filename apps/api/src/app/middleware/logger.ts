import { ConfigService } from '@kitouch/be-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';

export const logger =
  (app: NestExpressApplication) =>
  (req: Request, res: Response, next: NextFunction) => {
    const configService = app.get(ConfigService);

    console.log(
      `[Request]: ${req.method}, ${req.url}, ${JSON.stringify(
        req.query,
      )}, ${JSON.stringify(
        req.params,
      )}, version: ${configService.getEnvironment('version')}, ${JSON.stringify(
        configService.getEnvironment(),
      )}`,
    );

    next();
  };
