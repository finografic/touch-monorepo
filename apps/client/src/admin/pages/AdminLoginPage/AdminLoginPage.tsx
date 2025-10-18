import React from 'react';

import { LoginForm } from 'components/LoginForm/LoginForm';

export const AdminLoginPage: React.FC = () => {
  return (
    <LoginForm
      variant="light"
      title="Admin Access"
      subtitle="Sign in with admin credentials to access the administration panel"
      showSignUp={false}
    />
  );
};
