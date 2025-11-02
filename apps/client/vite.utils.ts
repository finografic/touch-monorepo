import { COOKIE_DELETE_ATTRIBUTES, COOKIES } from '@workspace/config/cookies.config';

import chalk from 'chalk';
import type { Plugin, UserConfig } from 'vite';

import { envClient } from './env.client';

export function logApiURL({ mode }: Pick<UserConfig, 'mode'>) {
  console.log(
    chalk.cyan.dim(`[API ${mode || envClient.NODE_ENV || 'development'}]`),
    chalk.cyan.dim(envClient.API_URL),
  );
}

export function devCookieClearPlugin(): Plugin {
  let isFirstRequestAfterStartup = true; // Flag to ensure it runs only once per server startup

  return {
    name: 'dev-cookie-clear',
    apply: 'serve', // This plugin should only apply in development mode (when serving)

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Check if this is the first request since the dev server started
        if (isFirstRequestAfterStartup) {
          console.log('🍪 [dev-cookie-clear] Clearing auth_token cookie on dev server startup...');

          // Set the 'auth_token' cookie to expire immediately
          // Path and Domain must match the original cookie for successful deletion
          // res.setHeader(
          //   'Set-Cookie',
          //   `${envClient.AUTH_COOKIE_SUFFIX}=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`,
          // );

          const tokenCookie = `${COOKIES.TOKEN_COOKIE}=; ${COOKIE_DELETE_ATTRIBUTES}`;
          const dataCookie = `${COOKIES.DATA_COOKIE}=; ${COOKIE_DELETE_ATTRIBUTES}`;

          res.setHeader('Set-Cookie', tokenCookie);
          res.setHeader('Set-Cookie', dataCookie);

          // Reset the flag so this logic doesn't run on subsequent requests, refreshes, or HMR
          isFirstRequestAfterStartup = false;

          console.log('✅ [dev-cookie-clear] Cookie cleared - auth_token will be removed on next page load');
        }
        next(); // Continue to the next middleware/handler
      });
    },
  };
}
