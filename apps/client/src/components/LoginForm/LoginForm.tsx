import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from 'components/Button';
import { Input } from 'components/Input/Input';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import { styles } from './LoginForm.styles';

interface LoginFormProps {
  variant: 'dark' | 'light';
  title: string;
  subtitle?: string;
  showSignUp?: boolean;
  onSuccess?: (args: { redirectUrl: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  variant,
  title,
  subtitle,
  showSignUp = false,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  // const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = String(location.pathname.startsWith('/admin') ? '/admin' : '/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        result = await signUp({ email, password, name });
      } else {
        result = await signIn({ email, password });
      }

      if (result.success) {
        onSuccess?.({ redirectUrl });
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div css={styles.container(variant)}>
      <div css={styles.formWrapper(variant)}>
        <div css={styles.header(variant)}>
          <h1 css={styles.title(variant)}>{title}</h1>
          {subtitle && <p css={styles.subtitle(variant)}>{subtitle}</p>}
        </div>

        <form css={styles.form} onSubmit={handleSubmit}>
          {isSignUp && (
            <div css={styles.inputGroup}>
              <label css={styles.label(variant)} htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter your name"
                required={isSignUp}
                disabled={isLoading}
                variant={variant}
              />
            </div>
          )}

          <div css={styles.inputGroup}>
            <label css={styles.label(variant)} htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              variant={variant}
            />
          </div>

          <div css={styles.inputGroup}>
            <label css={styles.label(variant)} htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              variant={variant}
            />
          </div>

          {error && <div css={styles.error(variant)}>{error}</div>}

          <Button type="submit" disabled={isLoading} css={styles.submitButton(variant)}>
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        {showSignUp && (
          <div css={styles.switchMode(variant)}>
            <p css={styles.switchText(variant)}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <Button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              css={styles.switchButton(variant)}
              disabled={isLoading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
