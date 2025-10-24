import { z } from 'zod';

// Client environment schema - only validate Vite environment variables
const envClientSchema = z.object({
  VITE_APP_NAME: z.string().default('ServiFresh'),
});

const envClientValidated = envClientSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
});

// Get shared environment from process.env (provided by Vite's define config)
export const env = {
  // Shared env vars (injected by Vite config)
  NODE_ENV: process.env.NODE_ENV as string,
  API_PROTOCOL: process.env.API_PROTOCOL as string,
  API_HOST: process.env.API_HOST as string,
  API_PORT: Number(process.env.API_PORT),
  API_BASE_PATH: process.env.API_BASE_PATH as string,
  API_URL: process.env.API_URL as string,
  CLIENT_PROTOCOL: process.env.CLIENT_PROTOCOL as string,
  CLIENT_HOST: process.env.CLIENT_HOST as string,
  CLIENT_PORT: Number(process.env.CLIENT_PORT),
  // Client-specific env vars
  ...envClientValidated,
} as const;

export type EnvClient = typeof env;
