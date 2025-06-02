import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { auth, ConfigParams } from 'express-openid-connect';
import session from 'express-session';
import { AppModule } from './app/app.module';
import { AppWideLogger } from './app/middleware/logger';

import { AuthService } from '@kitouch/be-auth';
import { ConfigService } from '@kitouch/be-config';
import { KitService } from '@kitouch/be-kit';
import { LoggingInterceptor } from '@kitouch/infra';
import { Auth0Kit, Auth0User } from '@kitouch/shared-models';
import { NestExpressApplication } from '@nestjs/platform-express';
import axios from 'axios';
import { doubleCsrf } from 'csrf-csrf';
import helmet from 'helmet';
import MongoStore from 'connect-mongo';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  const baseUrl = configService.getEnvironment('baseUrl'),
    feUrl = configService.getEnvironment('feUrl'),
    isProduction = configService.getEnvironment('production');

  const { sessionSecret, clientSecret, authSecret, clientId, issuerBaseUrl } =
    configService.getConfig('auth');

  const domainBase = isProduction ? '.kitouch.io' : undefined;

  // https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614s
  app.set('trust proxy', 1);

  app.use(cookieParser(sessionSecret));

  const mongooseConnection = app.get<Connection>(getConnectionToken());
  const connectionStr =
    configService.getConfig('atlasUri') + '&appName=kit-dev';

  // console.log(connectionStr, mongooseConnection.getClient(), 'mongoUrl');

  const sessionName = 'kitouch.sid';
  app.use(
    session({
      name: sessionName,
      secret: sessionSecret,
      resave: true,
      saveUninitialized: true,
      proxy: true, // !isProduction,
      store: MongoStore.create({
        // mongoUrl: connectionStr,
        clientPromise: Promise.resolve(mongooseConnection.getClient()),
        collectionName: 'app_sessions',
        ttl: 7 * 24 * 60 * 60, // e.g., 7 days in seconds
        autoRemove: 'disabled',
        crypto: {
          secret: authSecret,
        },
      }),
      cookie: {
        path: '/',
        domain: domainBase,
        secure: isProduction,
        httpOnly: true,
        maxAge: 3600000, // Session duration (e.g., 1 hour)
        sameSite: 'lax', // could be changed to 'strict' once docker will have both API and Web on the same domain
      },
    })
  );

  app.enableCors({
    origin: function (origin, callback) {
      if (!isProduction && /localhost:4200/.test(origin)) {
        console.info('[MAIN.ts] CORS origin:', origin);
        // Allow localhost for dev
        callback(null, true);
        return;
      }

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

  // Configure express-openid-connect
  const config: ConfigParams = {
    authRequired: false, // Don't require auth for all routes
    auth0Logout: true,
    baseURL: baseUrl,
    clientID: clientId,
    issuerBaseURL: issuerBaseUrl,
    //
    secret: authSecret,
    clientSecret,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email',
      // audience: baseURL,
    },
    session: {
      cookie: {
        httpOnly: true, // Keep HttpOnly
        secure: isProduction, // Use dynamic secure flag
        sameSite: 'Lax',
        domain: domainBase, // <<< ADD domain for cross-subdomain function
        path: '/', // Usually root path is fine
        // maxAge can be set, but library often manages based on OIDC flow duration
      },
    },
    afterCallback: async (req, res, session) => {
      res.clearCookie('jwt', {
        domain: domainBase,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
      });

      // Check if authentication was actually successful (session should contain tokens)
      if (!session.id_token || !session.access_token) {
        console.error(
          '[MAIN.ts] Authentication failed before afterCallback - Missing tokens.'
        );
        res.redirect(`${feUrl}?error=auth_failed`);
        return session;
      }

      const authService = app.get(AuthService);
      let user: any;

      try {
        const userInfoReq = await axios(`${issuerBaseUrl}/userInfo`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (userInfoReq.status === 200 && userInfoReq.data) {
          user = userInfoReq.data;
        }
        if (!isProduction) {
          console.info('\nUser:', user);
        }
      } catch (error) {
        console.error(
          'Error fetching from /userinfo:',
          error.response?.data || error.message
        );
        // Handle the error - maybe redirect to login with an error flag
        res.redirect(`${feUrl}?error=userinfo_failed`);
        return session; // Stop processing if userinfo fails
      }

      const auth0User: Auth0User = {
        sub: user.sub,
        email: user.email,
        name: user.given_name ?? user.name ?? user.nickname,
        surname: user.family_name,
        picture: user.picture,
        email_verified: user.email_verified,
      };

      // get KIT user from auth0 user
      const kitService = app.get(KitService);
      const kitAccount = await kitService.auth0AccountFindAndUpdate(auth0User);
      const kitUser = await kitService.accountUserFindAndUpdate(kitAccount);
      const kitProfiles = await kitService.profilesFindOrInsert(
        kitUser,
        auth0User
      );

      const authKit: Auth0Kit = {
        ...auth0User,
        account: kitAccount as any, // as Account
        user: kitUser as any, //as User
        profiles: kitProfiles as any, // Array<Profile>,
      };

      const appToken = await authService.generateJWT(authKit);

      res.cookie('jwt', appToken, {
        domain: domainBase,
        httpOnly: true,
        secure: isProduction,
        maxAge: 3600 * 1000,
        sameSite: 'lax',
        path: '/',
      });
      // (req.session as any).loggedIn = true;

      console.info(
        '[NEW Session set] Token: %s',
        !isProduction ? appToken : `not visible in prod`
      );
      // Return the session object (required by afterCallback)
      return {
        ...session,
        user: authKit,
      };
    },
    routes: {
      login: '/api/auth/login',
      callback: '/api/auth/callback',
      // to inject clearing JWT token before calling endpoint we first implement custom logout that calls native Auth0 endpoint
      logout: false,
      postLogoutRedirect: `${feUrl}`,
    },
    getLoginState(req, options) {
      return {
        ...options,
        returnTo: `${feUrl}/redirect`, //options.returnTo
      };
    },
  };
  app.use(auth(config));

  const globalPrefix = configService.getEnvironment('apiPrefix');
  app.setGlobalPrefix(globalPrefix);

  app.use(AppWideLogger(app));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const {
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf({
    cookieName: 'csrf-token', // The name of the CSRF token cookie
    cookieOptions: {
      domain: domainBase,
      httpOnly: false,
      secure: isProduction,
      maxAge: 3600 * 1000,
      sameSite: 'lax',
      path: '/',
    },
    getSecret: () => configService.getConfig('csrfSec'), // A function that optionally takes the request and returns a secret
    getSessionIdentifier: (req) => {
      return req.session.id;
    },
  });
  app.use((req, res, next) => {
    return doubleCsrfProtection(req, res, next);
  });

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  if ((module as any).hot) {
    (module as any).hot.accept();
    (module as any).hot.dispose(() => app.close());
  }

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}${globalPrefix}`
  );
}

bootstrap();
