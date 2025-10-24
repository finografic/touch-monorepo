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
