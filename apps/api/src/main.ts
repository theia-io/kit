import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { auth, ConfigParams } from 'express-openid-connect';
import session from 'express-session';
import { AppModule } from './app/app.module';
import { logger } from './app/middleware/logger';

import { AuthService } from '@kitouch/be-auth';
import { ConfigService } from '@kitouch/be-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

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

  const configService = app.get(ConfigService);

  const baseUrl = configService.getEnvironment('baseUrl'),
    feUrl = configService.getEnvironment('feUrl');
  const { sessionSecret, clientSecret, authSecret, clientId, issuerBaseUrl } =
    configService.getConfig('auth');

  app.use(
    session({
      secret: sessionSecret,
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
    afterCallback: async (req, res, session) => {
      // session contains the id_token, access_token, user claims
      console.log('\nSession Object:', JSON.stringify(session, null, 2)); // Log the whole session

      // Check if authentication was actually successful (session should contain tokens)
      if (!session.id_token || !session.access_token) {
        console.error(
          'Authentication failed before afterCallback - Missing tokens.'
        );
        // Redirect to an error page or login
        res.redirect(`${feUrl}?error=auth_failed`);
        // MUST return session even on error to avoid hanging
        return session;
      }

      let user: any;
      try {
        const userInfoReq = await axios(`${issuerBaseUrl}/userinfo`, {
          headers: {
            // *** Use the access_token from the session ***
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (userInfoReq.status === 200 && userInfoReq.data) {
          user = userInfoReq.data;
        }
        console.log('\nUser:', user);
      } catch (error) {
        console.error(
          'Error fetching from /userinfo:',
          error.response?.data || error.message
        );
        // Handle the error - maybe redirect to login with an error flag
        res.redirect(`${feUrl}?error=userinfo_failed`);
        return session; // Stop processing if userinfo fails
      }

      // Generate your application's JWT
      const authService = app.get(AuthService);
      const {
        email,
        given_name: name,
        family_name: surname,
        picture,
        email_verified,
      } = user;
      const appToken = await authService.generateJWT({
        email,
        name,
        surname,
        picture,
        email_verified,
      }); // Use Auth0 user info

      // Set your application's JWT cookie
      res.cookie('jwt', appToken, {
        httpOnly: true,
        secure: false, //configService.get('NODE_ENV') === 'production',
        maxAge: 3600 * 1000,
        sameSite: false, //'strict',
        path: '/',
      });

      // Return the session object (required by afterCallback)
      return {
        ...session,
        user,
      };
    },
    routes: {
      login: '/api/auth/login',
      callback: '/api/auth/callback',
      logout: '/api/auth/logout',
      postLogoutRedirect: `${feUrl}`,
    },
    getLoginState(req, options) {
      return {
        ...options,
        returnTo: `${feUrl}/s/redirect-auth0`, //options.returnTo || req.originalUrl,
        // customState: 'foo'
      };
    },
  };
  app.use(auth(config));

  // if (process.env.NODE_ENV === 'production') {
  //   app.set('trust proxy', 1); // trust first proxy
  //   sess.cookie.secure = true; // serve secure cookies, requires https
  // }

  // https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614s
  // TODO TEST this in prod
  app.set('trust proxy', 1);

  app.use(cookieParser());

  const globalPrefix = configService.getEnvironment('apiPrefix');
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
