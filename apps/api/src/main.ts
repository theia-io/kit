/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import session from 'express-session';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { logger } from './app/middleware/logger';

import * as dotenv from 'dotenv';
import * as path from 'path';
import { environment } from './environments/environment';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    'config/',
    environment.production ? '.env' : '.env.local'
  ),
});

console.log(
  'path',
  path.resolve(
    process.cwd(),
    'config/',
    environment.production ? '.env' : '.env.local'
  )
);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

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

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    process.exit(1);
  }

  console.log('process.envs', process.env.NODE_ENV, process.env.JWT_SECRET);

  // if (process.env.NODE_ENV === 'production') {
  //   app.set('trust proxy', 1); // trust first proxy
  //   sess.cookie.secure = true; // serve secure cookies, requires https
  // }
  // TODO TEST this in prod
  app.set('trust proxy', 1);

  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: false,
      proxy: true, // TODO TEST this in prod
      cookie: {
        secure: false, //process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 3600000, // Session duration (e.g., 1 hour)
        sameSite: false, //'strict',
      },
    })
  );

  app.use(cookieParser());

  app.setGlobalPrefix(globalPrefix);
  app.use(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    })
  );

  const port = process.env.PORT || 3000;
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
