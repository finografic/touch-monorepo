import type { AuthRoles } from 'admin/config/admin.routes.map';

export interface AuthSignInParams {
  email: string;
  password: string;
}

export interface AuthSignUpParams extends AuthSignInParams {
  name: string;
}

export interface AuthReturnParams {
  success: boolean;
  message?: string;
  error?: unknown;
}

export interface AuthUser {
  role: AuthRoles;
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface AuthSessionData {
  user: AuthUser | null;
}
