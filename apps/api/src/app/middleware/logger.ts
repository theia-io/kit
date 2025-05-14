import { ConfigService } from '@kitouch/be-config';
import { getCircularReplacer } from '@kitouch/utils';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';

export const AppWideLogger =
  (app: NestExpressApplication) =>
  (req: Request, res: Response, next: NextFunction) => {
    const configService = app.get(ConfigService);
    const { cookie, ...restHeadersSafeToLog } = req.headers;

    // Select specific properties to log
    const requestInfoToLog = {
      method: req.method,
      url: req.originalUrl || req.url, // originalUrl includes the base path
      headers: restHeadersSafeToLog, // Be careful logging all headers, might contain sensitive info
      query: req.query,
      params: req.params,
      body: req.body, // Be careful logging body, might contain sensitive info or be very large
      ip: req.ip,
      // Add user info if available (this still relies on the logger running AFTER guards if you need req.user)
      // user: req.user ? { sub: (req.user as Auth0Kit)?.sub, email: (req.user as Auth0Kit)?.email } : undefined,
    };

    console.info(`\n[AppWideLogger] ${req.method}, ${req.url}`);
    console.info(
      '\n[AppWideLogger Req]:',
      JSON.stringify(requestInfoToLog, getCircularReplacer(), 2)
    );
    console.info(`\n[Version]:${configService.getEnvironment('version')}`);
    console.info('\n[Env]:\n', configService.getEnvironment());

    next();
  };
