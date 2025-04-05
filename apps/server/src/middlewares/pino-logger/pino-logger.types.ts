import type { Level } from 'pino';
import type { Options } from 'pino-http';

// Create a stricter type for our options
export type StrictPinoOptions = Omit<Options, 'customSuccessMessage' | 'customErrorMessage'> & {
  customSuccessMessage: (req: any, res: any) => string;
  customErrorMessage: (req: any, res: any, err: Error) => string;
};

export type LevelCustom = Level & 'success';
