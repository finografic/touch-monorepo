import type { RequestMethod } from 'types/request.types';
import { envShared } from '@fino/config/envShared';
import chalk from 'chalk';
import { CLI } from 'utils/utils.cli';
import { cors } from 'hono/cors';
import configureOpenAPI from 'lib/configure-open-api';
import createApp from 'lib/create-app';
import auth from 'routes/auth/auth.routes';

import health from 'routes/health-check/health-check.index';
// Import routes
import index from 'routes/index.route';
import users from 'routes/users';
import drinkType from 'routes/drink-type';
import drinkVolume from './routes/drink-volume';

const app = createApp();

app.use(
  '/*',
  cors({
    origin: [envShared.CLIENT_ORIGIN],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use('*', async (context, next) => {
  const method = context.req.method as RequestMethod;
  const path = context.req.path;
  console.log(CLI.BR, CLI.HR_1);
  console.log(CLI.METHOD[method], chalk.cyan(path), CLI.BR);
  await next();
});

configureOpenAPI(app);

const routesDrinkFlow = [drinkType, drinkVolume] as const;
const routes = [index, health, auth, users, ...routesDrinkFlow] as const;

routes.forEach((route) => {
  app.route(envShared.API_BASE_PATH, route);
});

export type AppType = (typeof routes)[number];

export default app;
