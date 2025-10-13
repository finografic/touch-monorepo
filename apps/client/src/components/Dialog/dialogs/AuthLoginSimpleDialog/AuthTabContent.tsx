import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'components/ButtonRadix/Button';
import { Input } from 'components/Input/Input';
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
  // const [animatedPlaceholder, setAnimatedPlaceholder] = useState('Enter password');

  // Generate random password mask based on activeTab for visual feedback [Claude v3.5]
  const randomPasswordMask = useMemo(() => {
    // Create a seed based on activeTab to ensure consistent randomness per tab
    const seed = activeTab.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280; // Simple LCG for consistent randomness

    // Generate random number of dots between 6-12 (different from actual password length)
    const dotCount = 6 + (random % 7);
    console.log('%c MASK', 'color:hotpink', activeTab, dotCount);
    return '•'.repeat(dotCount);
  }, [activeTab]);

  /*
  // Generate animated placeholder based on activeTab for visual feedback [Claude v3.5]
  useEffect(() => {
    // Create a seed based on activeTab for consistent randomness
    const seed = activeTab.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280; // Simple LCG

    // Generate random number of dots between 6-12 (different from actual password length of 11)
    const dotCount = 6 + (random % 7);
    const randomPlaceholder = '•'.repeat(dotCount);

    console.log('%c MASK', 'color:hotpink', activeTab, dotCount);

    // Set animated placeholder immediately
    setAnimatedPlaceholder(randomPlaceholder);

    // After 400ms, set the actual placeholder
    const timer = setTimeout(() => {
      setAnimatedPlaceholder('Enter password');
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab]);
  */

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
              value={randomPasswordMask || password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
              placeholder={randomPasswordMask}
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
