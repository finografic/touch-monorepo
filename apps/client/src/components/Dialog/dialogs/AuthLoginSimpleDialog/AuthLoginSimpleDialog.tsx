import React, { useState } from 'react';
import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { Button } from 'components/Button/Button';
import { Input } from 'components/Input/Input';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { styles } from './AuthLoginSimpleDialog.styles';

const DEFAULT_USER_ADMIN = 'admin@example.com';
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
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(DEFAULT_USER_ADMIN, password);

      if (result.success) {
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
    minHeight: '300px',
    minWidth: '350px',
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
          <div css={styles.container} id="simple-login-dialog">
            <div css={styles.formWrapper}>
              <form css={styles.form} onSubmit={handleSubmit}>
                <div css={styles.inputGroup}>
                  <label css={styles.label} htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    disabled={isLoading}
                    variant="dark"
                  />
                </div>

                {error && <div css={styles.error}>{error}</div>}

                <Button type="submit" disabled={isLoading} css={styles.submitButton}>
                  {isLoading ? 'Loading...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </div>
        ),
      },
    ],
  };

  return <GenericDialog isOpen={isOpen} onClose={onClose} config={config} />;
};
