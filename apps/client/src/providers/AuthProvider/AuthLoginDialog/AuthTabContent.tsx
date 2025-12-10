import React, { useEffect, useState } from 'react';
import { Input } from 'forms/Input/Input';
import { Button } from 'components/Button';
import { useAuth } from 'providers/AuthProvider';
import { styles } from './AuthLoginDialog.styles';

interface AuthLoginTabContentProps {
  activeTab: string;
  email: string;
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

/**
 * Reusable tab content component for login dialog [Claude v3.5]
 */
export const AuthLoginTabContent: React.FC<AuthLoginTabContentProps> = ({
  activeTab,
  email,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
  const { isAuthenticated } = useAuth();
  const [placeholderMask, setPlaceholderMask] = useState('');

  useEffect(() => {
    const dotCount = Math.max(Math.round(Math.random() * 7) + Math.round(Math.random() * 7) * 0.7) + 6; // random dots;
    const randomPlaceholder = '•'.repeat(dotCount);

    setPlaceholderMask(randomPlaceholder);

    const timer = setTimeout(() => {
      setPlaceholderMask('');
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div css={styles}>
      <div className="form-wrapper">
        {/* <div className="email-subtitle">
          <strong>Email:</strong> {email}
        </div> */}
        <form className="form" onSubmit={onSubmit}>
          <div className="input-group">
            <label className="label" htmlFor="password">
              Password
              <span className="hint">password123</span>
            </label>
            <Input
              id="password"
              type="password"
              value={placeholderMask || password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <Button type="submit" disabled={isLoading} size="md" color="info" className="submit-button">
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
