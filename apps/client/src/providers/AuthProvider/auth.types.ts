export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  role: 'user' | 'admin'; // Admin plugin role field [Claude v3.5]
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  session: any;
}

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
