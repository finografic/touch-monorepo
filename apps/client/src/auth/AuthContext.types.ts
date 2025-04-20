import type { LoginCredentials, User } from '../api/auth';

export interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}
