import '@workspace/globals';
import { serve } from '@hono/node-server';
import chalk from 'chalk';
import app from './app';
import { env } from './env.server';

console.log('🚀  API Listening:', chalk.cyan(`${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}`));

serve({
  fetch: app.fetch,
  port: env.API_PORT,
});
