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
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

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

  const { sessionSecret, clientSecret, authSecret, clientId, issuerBaseUrl } =
    configService.getConfig('auth');

  const domainBase = isProduction ? '.kitouch.io' : undefined;

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      proxy: true, // !isProduction,
      cookie: {
        path: '/',
        domain: domainBase,
        secure: isProduction,
        httpOnly: true,
        maxAge: 3600000, // Session duration (e.g., 1 hour)
        sameSite: isProduction ? 'lax' : false, // could be changed to 'strict' once docker will have both API and Web on the same domain
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
    session: {
      cookie: {
        httpOnly: true, // Keep HttpOnly
        secure: isProduction, // Use dynamic secure flag
        sameSite: 'Lax', // <<< Use 'lax' for compatibility with redirects
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
        sameSite: isProduction ? 'lax' : false,
        path: '/',
      });

      // session contains the id_token, access_token, user claims
      if (!isProduction) {
        console.info(
          '\n[MAIN.ts] Session Object: %s',
          JSON.stringify(session, null, 2)
        ); // Log the whole session
      }

      // Check if authentication was actually successful (session should contain tokens)
      if (!session.id_token || !session.access_token) {
        console.error(
          '[MAIN.ts] Authentication failed before afterCallback - Missing tokens.'
        );
        // Redirect to an error page or login
        res.redirect(`${feUrl}?error=auth_failed`);
        // MUST return session even on error to avoid hanging
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
        // const { email } = authService.decode(session.id_token);
        // const auth0UserUrl = new URL(`${issuerBaseUrl}/api/v2/users`);
        // auth0UserUrl.search = new URLSearchParams({
        //   search_engine: 'v3',
        //   q: email,
        // }).toString();

        // const userInfoReq = await axios(auth0UserUrl.toString(), {
        //   headers: {
        //     Authorization:
        //       'Bearer',
        //   },
        // });

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
        sameSite: isProduction ? 'lax' : false,
        path: '/',
      });

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

  // if (process.env.NODE_ENV === 'production') {
  //   app.set('trust proxy', 1); // trust first proxy
  //   sess.cookie.secure = true; // serve secure cookies, requires https
  // }

  // https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614s
  // if (!isProduction) {
  app.set('trust proxy', 1);
  // }

  app.use(cookieParser());

  const globalPrefix = configService.getEnvironment('apiPrefix');
  app.setGlobalPrefix(globalPrefix);

  app.use(AppWideLogger(app));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const {
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf({
    getSecret: () => configService.getConfig('csrfSec'), // A function that optionally takes the request and returns a secret
    getSessionIdentifier: (req) => req.session.id, // A function that returns the unique identifier for the request
  });
  app.use(doubleCsrfProtection);

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
