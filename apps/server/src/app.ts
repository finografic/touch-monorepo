import { envShared } from '@workspace/config/env.shared';

import chalk from 'chalk';
import { cors } from 'hono/cors';

import auth from 'routes/auth/auth.routes';
import containerType from 'routes/container-type';
import drinkSubtypes from 'routes/drink-subtypes';
import drinkType from 'routes/drink-type';
import health from 'routes/health-check/health-check.index';
// Import routes
import index from 'routes/index.route';
import orders from 'routes/orders';
import relay from 'routes/relay';
import slotConfigurations from 'routes/slot-configurations';
import sounds from 'routes/sounds';
import supportedLanguage from 'routes/supported-language';
import translationsUi from 'routes/translations-ui';
import uiLabels from 'routes/ui-labels';
import users from 'routes/users';
import configureOpenAPI from 'lib/configure-open-api';
import createApp from 'lib/create-app';
import { CLI } from 'utils/utils.cli';
import type { RequestMethod } from 'types/request.types';
import drinkVolume from './routes/drink-volume';
import modes from './routes/modes';
import temperatureProfile from './routes/temperature-profile';

const app = createApp();

app.use(
  '/*',
  cors({
    origin: [envShared.CLIENT_ORIGIN || ''],
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
  uiLabels,
  translationsUi,
  relay,
] as const;

routes.forEach((route) => {
  app.route(envShared.API_BASE_PATH, route);
});

// Serve the React app for all non-API routes
app.get('*', async (c) => {
  const path = c.req.path;

  // Don't serve React app for API routes
  if (path.startsWith('/api/')) {
    return c.notFound();
  }

  try {
    const fs = await import('fs/promises');
    const pathModule = await import('path');
    const { fileURLToPath } = await import('url');

    // Get current directory in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = pathModule.dirname(__filename);

    // Determine the file path based on the request
    let filePath: string;

    if (path === '/' || path === '') {
      // Serve index.html for root path
      filePath = pathModule.join(__dirname, '../../../apps/client/dist/index.html');
    } else {
      // Serve other static files from the dist directory
      filePath = pathModule.join(__dirname, '../../../apps/client/dist', path);
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      // If file doesn't exist, serve index.html for SPA routing
      filePath = pathModule.join(__dirname, '../../../apps/client/dist/index.html');
    }

    const content = await fs.readFile(filePath, 'utf-8');

    // Determine MIME type based on file extension
    const ext = pathModule.extname(filePath).toLowerCase();
    let mimeType = 'text/html'; // default

    switch (ext) {
      case '.js':
        mimeType = 'application/javascript';
        break;
      case '.css':
        mimeType = 'text/css';
        break;
      case '.json':
        mimeType = 'application/json';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
      case '.ico':
        mimeType = 'image/x-icon';
        break;
      case '.woff':
        mimeType = 'font/woff';
        break;
      case '.woff2':
        mimeType = 'font/woff2';
        break;
      case '.ttf':
        mimeType = 'font/ttf';
        break;
      case '.eot':
        mimeType = 'application/vnd.ms-fontobject';
        break;
    }

    // Set appropriate headers
    c.header('Content-Type', mimeType);

    // For JavaScript and CSS files, use c.body() to preserve the MIME type
    if (mimeType === 'application/javascript' || mimeType === 'text/css') {
      return c.body(content);
    }

    return c.html(content);
  } catch (error) {
    // If the file doesn't exist, return a simple message
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.html(`
      <html>
        <head><title>Touch Client</title></head>
        <body>
          <h1>Touch Client Server</h1>
          <p>The server is running, but there was an error serving the client files.</p>
          <p>Error: ${errorMessage}</p>
          <p>Please ensure the client is built: <code>cd apps/client && pnpm build</code></p>
        </body>
      </html>
    `);
  }
});

export type AppType = (typeof routes)[number];

export default app;
