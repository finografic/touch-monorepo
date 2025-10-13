import React from 'react';
import { Button } from 'components/ButtonRadix/Button';
import { Input } from 'components/Input/Input';
import { styles } from './AuthLoginDialog.styles';

interface AuthLoginTabContentProps {
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
  email,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
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
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <Button type="submit" disabled={isLoading} variant="soft" size="3" className="submit-button">
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
