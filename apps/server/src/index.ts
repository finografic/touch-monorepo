import { serve } from '@hono/node-server';
import chalk from 'chalk';
import { env } from 'env.server';
import { networkInterfaces } from 'os';

import '@workspace/core';

import app from './app';

function getLanIp(): string | null {
  const nets = networkInterfaces();
  for (const iface of Object.values(nets)) {
    if (!iface) continue;
    for (const info of iface) {
      if (!info.internal && info.family === 'IPv4') return info.address;
    }
  }
  return null;
}

const lanIp = getLanIp();

console.log(
  `${chalk.greenBright('●')}  App Ready: ${chalk.greenBright(`http://localhost:${env.CLIENT_PORT}`)}`,
);
console.log(
  `${chalk.cyanBright('●')}  API Listening: ${chalk.cyanBright(`http://localhost:${env.API_PORT}`)}`,
);
if (lanIp) {
  console.log(
    `${chalk.cyanBright('🌐')} Remote Access: ${chalk.cyanBright(`http://${lanIp}:${env.CLIENT_PORT}`)}`,
  );
}

console.log('');

serve({ fetch: app.fetch, port: env.API_PORT });

// Note: USBRelay service will be initialized on-demand via /api/relay/init endpoint
