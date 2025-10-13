import React, { useState } from 'react';
import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { AuthLoginTabContent } from './AuthTabContent';
import { UserIcon, UserLockIcon } from 'styles/icons';

const DEFAULT_USER_EMAIL = 'user@example.com';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'password123';

interface AuthLoginSimpleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const AuthLoginSimpleDialog = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: AuthLoginSimpleDialogProps) => {
  const { signIn, refreshSession } = useAuth();

  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const getCurrentEmail = () => {
    const email = activeTab === 'admin' ? DEFAULT_ADMIN_EMAIL : DEFAULT_USER_EMAIL;
    console.log('getCurrentEmail', { tab: activeTab, email });
    return email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(getCurrentEmail(), password);

      if (result.success) {
        // Refresh session to get updated user data with role
        await refreshSession();
        onClose();
        onSuccess?.();
      } else {
        const errorMessage = result.error || 'Authentication failed';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const config: DialogConfig = {
    title: '',
    size: '3',
    maxWidth: '400px',
    maxHeight: '60vh',
    minHeight: '280px',
    minWidth: '350px',
    theme: {
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
    tabs: [
      {
        id: 'user',
        label: 'user',
        icon: <UserIcon />,
        content: (
          <AuthLoginTabContent
            email={DEFAULT_USER_EMAIL}
            password={password}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        ),
      },
      {
        id: 'admin',
        label: 'Admin',
        icon: <UserLockIcon />,
        content: (
          <AuthLoginTabContent
            email={DEFAULT_ADMIN_EMAIL}
            password={password}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        ),
      },
    ],
  };

  return (
    <GenericDialog
      isOpen={isOpen}
      onClose={onClose}
      config={config}
      defaultTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};
