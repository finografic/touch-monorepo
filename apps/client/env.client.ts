import { envShared } from '@workspace/config/env.shared';

import { z } from 'zod';

const ClientEnvSchema = z.object({
  VITE_APP_NAME: z.string().default('ServiFresh'),
});

const envClientValidated = ClientEnvSchema.parse({});

export const envClient = {
  ...envShared,
  ...envClientValidated,
} as const;

export type EnvClient = typeof envClient;
