/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { auth } from 'express-openid-connect';

import { AppModule } from './app/app.module';
import { logger } from './app/middleware/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });

  const globalPrefix = 'api';
  app.enableCors({
    origin: function (origin, callback) {
      console.log('CORS origin:', origin);
      if (!origin || origin === 'null') {
        // Don't allow requests with no origin (like mobile apps or curl requests)
        // callback(new Error('Not allowed without valid origin'));
        // Allow requests with no origin (like mobile apps or curl requests or healthcheck)
        callback(null, true);
      } else {
        // Check if the origin is allowed
        const allowedOrigin = /^https?:\/\/(.*\.)?kitouch\.io$/.test(origin);
        if (allowedOrigin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.setGlobalPrefix(globalPrefix);
  app.use(logger);

  const port = process.env.PORT || 3000;

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'hInvlb9QK8mQH2PBa69ZxBFh3uFxSUcg',
    issuerBaseURL: 'https://dev-mjhqkc36ox0wieg1.us.auth0.com',
  };

  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));

  // app.get('/profile', requiresAuth(), (req, res) => {
  //   res.send(JSON.stringify(req.oidc.user));
  // });

  await app.listen(port);
  if ((module as any).hot) {
    (module as any).hot.accept();
    (module as any).hot.dispose(() => app.close());
  }

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
