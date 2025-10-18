import React from 'react';

import { LoginForm } from 'components/LoginForm/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <LoginForm
      variant="dark"
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      showSignUp={true}
    />
  );
};
