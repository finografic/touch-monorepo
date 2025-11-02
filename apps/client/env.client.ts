import { envShared } from '@workspace/config/env.shared';

import { z } from 'zod';

const ClientEnvSchema = z.object({
  VITE_APP_NAME: z.string().default('ServiFresh'),
});

const clientVars = ClientEnvSchema.parse(import.meta.env);

export const envClient = {
  ...envShared,
  ...clientVars,
} as const;

export type EnvClient = typeof envClient;
