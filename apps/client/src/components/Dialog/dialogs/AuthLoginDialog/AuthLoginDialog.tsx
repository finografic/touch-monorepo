import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { LoginForm } from 'components/LoginForm/LoginForm';
import { useAuth } from 'providers/AuthProvider/AuthContext';

interface AuthLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthLoginDialog = ({ isOpen, onClose }: AuthLoginDialogProps) => {
  const { isAuthenticated } = useAuth();

  const handleLoginSuccess = () => {
    onClose();
  };

  const config: DialogConfig = {
    title: 'Quick Login',
    size: '3',
    maxWidth: '500px',
    maxHeight: '80vh',
    minHeight: '400px',
    minWidth: '450px',
    theme: {
      appearance: 'dark',
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
    tabs: [
      {
        id: 'login',
        label: 'Sign In',
        content: (
          <div style={{ padding: '1rem' }}>
            <LoginForm
              variant="dark"
              title="Welcome Back"
              subtitle="Sign in to your account"
              showSignUp={false}
              onSuccess={handleLoginSuccess}
            />
          </div>
        ),
      },
    ],
    footer: {
      primaryButton: {
        label: 'Close',
        onClick: onClose,
        variant: 'soft',
        color: 'blue',
      },
    },
  };

  return <GenericDialog isOpen={isOpen} onClose={onClose} config={config} />;
};
