import type { EnvClient } from 'env.client.ts';

const envClient = { ...process.env } as EnvClient;

export default { ...envClient } as EnvClient;
