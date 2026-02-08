import { serve } from '@hono/node-server';
import chalk from 'chalk';
import { env } from 'env.server';

import '@workspace/core';

import app from './app';

console.log('🚀 App Ready:', chalk.cyan(`${env.CLIENT_PROTOCOL}://${env.CLIENT_HOST}:${env.CLIENT_PORT}`));
console.log('🚀 API Listening:', chalk.cyan(`${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}`));

serve({
  fetch: app.fetch,
  port: env.API_PORT,
});

// Note: USBRelay service will be initialized on-demand via /api/relay/init endpoint
