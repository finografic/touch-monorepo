import { z } from 'zod';

const envClientSchema = z.object({
  VITE_APP_NAME: z.string(),
});

const envClientValidated = envClientSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
});

export const env = {
  ...process.env,
  ...envClientValidated,
} as const;

export type EnvClient = typeof env;
