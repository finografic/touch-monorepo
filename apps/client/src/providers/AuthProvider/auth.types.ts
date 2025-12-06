import type { AuthRoles } from 'apps/client/src/admin/config/admin-routes.map';

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
  createdAt: number;
  updatedAt: number;
}

export interface AuthUserResult {
  role: any;
  id: string;
  email: string;
  name: string;
  image: string | number | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSessionData {
  redirect: boolean;
  token: string;
  user: AuthUserResult | AuthUser | null;
}
