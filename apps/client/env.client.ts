import { envShared } from '@workspace/config/env.shared';

import * as v from 'valibot';

const ClientEnvSchema = v.object({
  VITE_APP_NAME: v.optional(v.string(), 'ServiFresh'),
});

const envClientValidated = v.parse(ClientEnvSchema, {});

export const envClient = {
  ...envShared,
  ...envClientValidated,
} as const;

export type EnvClient = typeof envClient;
