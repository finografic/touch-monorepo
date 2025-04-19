import type { RequestMethod } from 'types/request.types';
import { envShared } from '@fino/config/envShared';
import chalk from 'chalk';
import { cors } from 'hono/cors';
import configureOpenAPI from 'lib/configure-open-api';
import createApp from 'lib/create-app';
import auth from 'routes/auth/auth.routes';

import health from 'routes/health-check/health-check.index';
// Import routes
import index from 'routes/index.route';
import users from 'routes/users';
import drinkType from 'routes/drink-type';
import posts from 'routes/posts';
import { CLI } from 'utils/utils.cli';

const app = createApp();

app.use(
  '/*',
  cors({
    origin: [envShared.CLIENT_ORIGIN],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use('*', async (c, next) => {
  const method = c.req.method as RequestMethod;
  const path = c.req.path;
  console.log(CLI.BR, CLI.HR_1);
  console.log(CLI.METHOD[method], chalk.cyan(path), CLI.BR);
  await next();
});

configureOpenAPI(app);

const routes = [index, health, auth, users, drinkType, posts] as const;

routes.forEach((route) => {
  app.route(envShared.API_BASE_PATH, route);
});

export type AppType = (typeof routes)[number];

export default app;
