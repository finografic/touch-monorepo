import type { User } from 'src/api/auth';

export interface RouterContext {
  auth: {
    user: User | undefined;
  };
}
