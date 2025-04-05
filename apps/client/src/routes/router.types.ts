import type { User } from 'lib/api/auth';

export interface RouterContext {
  auth: {
    user: User | undefined;
  };
}
