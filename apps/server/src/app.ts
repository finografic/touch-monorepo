import { envShared } from '@workspace/config/env.shared';

import chalk from 'chalk';
import { cors } from 'hono/cors';

import appConfiguration from 'routes/app-configuration';
import auth from 'routes/auth/auth.routes';
import containerType from 'routes/container-type';
import drinkSubtypes from 'routes/drink-subtypes';
import drinkType from 'routes/drink-type';
import health from 'routes/health-check/health-check.index';
import i18n from 'routes/i18n';
import index from 'routes/index.route';
import orders from 'routes/orders';
import relay from 'routes/relay';
import slotConfigurations from 'routes/slot-configurations';
import sounds from 'routes/sounds';
import supportedLanguage from 'routes/supported-language';
import translations from 'routes/translations';
import users from 'routes/users';
import configureOpenAPI from 'lib/configure-open-api';
import createApp from 'lib/create-app';
import { CLI } from 'utils/cli.utils';
import { getMimeType } from 'utils/mime.utils';
import type { RequestMethod } from 'types/request.types';
import drinkVolume from './routes/drink-volume';
import modes from './routes/modes';
import temperatureProfile from './routes/temperature-profile';

const app = createApp();

app.use(
  '/*',
  cors({
    // Accept any origin so the app works from any IP on the local network.
    // The client port may differ from the API port, making requests cross-origin.
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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

const routesDrinkFlow = [
  drinkType,
  drinkSubtypes,
  drinkVolume,
  containerType,
  modes,
  temperatureProfile,
] as const;

const routes = [
  index,
  health,
  auth,
  users,
  ...routesDrinkFlow,
  orders,
  supportedLanguage,
  sounds,
  slotConfigurations,
  appConfiguration,
  translations,
  i18n,
  relay,
] as const;

routes.forEach((route) => {
  app.route(envShared.API_BASE_PATH, route);
});

// Serve React app
app.get('*', async (c) => {
  const path = c.req.path;

  if (path.startsWith('/api/')) {
    return c.notFound();
  }

  try {
    const fs = await import('fs/promises');
    const pathModule = await import('path');
    const { fileURLToPath } = await import('url');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = pathModule.dirname(__filename);

    let filePath =
      path === '/' || path === ''
        ? pathModule.join(__dirname, '../../../apps/client/dist/index.html')
        : pathModule.join(__dirname, '../../../apps/client/dist', path);

    try {
      await fs.access(filePath);
    } catch {
      filePath = pathModule.join(__dirname, '../../../apps/client/dist/index.html');
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const { mimeType } = getMimeType({ filePath, pathModule });

    c.header('Content-Type', mimeType);
    return c.body(content);
  } catch (error) {
    return c.html('<h1>Client build missing</h1>');
  }
});

export default app;
