import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'components/Button';
import { Input } from 'components/Input/Input';
import { useAuth } from 'providers/AuthProvider';

import { NumericKeypad } from './NumericKeypad';
import { styles } from './KeypadLoginDialog.styles';

interface KeypadLoginTabContentProps {
  activeTab: string;
  email: string;
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

const MAX_PASSWORD_LENGTH = 4;

/**
 * Keypad login tab content with numeric keypad input
 * Only accepts numeric input, max 4 digits
 */
export const KeypadLoginTabContent: React.FC<KeypadLoginTabContentProps> = ({
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
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const dotCount = Math.max(Math.round(Math.random() * 7) + Math.round(Math.random() * 7) * 0.7) + 6; // random dots;
    const randomPlaceholder = '•'.repeat(dotCount);

    setPlaceholderMask(randomPlaceholder);

    const timer = setTimeout(() => {
      setPlaceholderMask('');
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Sync display value with password prop
  useEffect(() => {
    setDisplayValue(password);
  }, [password]);

  // Mask the password for display (show dots instead of numbers)
  const getMaskedValue = useCallback((value: string) => {
    return '•'.repeat(value.length);
  }, []);

  // Handle input change - only allow numbers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Only allow numeric characters
      const numericValue = inputValue.replace(/\D/g, '');

      // Limit to max length
      const trimmedValue = numericValue.slice(0, MAX_PASSWORD_LENGTH);

      setDisplayValue(trimmedValue);
      onPasswordChange(trimmedValue);
    },
    [onPasswordChange],
  );

  // Handle keypad digit press
  const handleDigitPress = useCallback(
    (digit: string) => {
      if (password.length >= MAX_PASSWORD_LENGTH) {
        return; // Already at max length
      }

      const newValue = password + digit;
      setDisplayValue(newValue);
      onPasswordChange(newValue);
    },
    [password, onPasswordChange],
  );

  // Handle backspace
  const handleBackspace = useCallback(() => {
    const newValue = password.slice(0, -1);
    setDisplayValue(newValue);
    onPasswordChange(newValue);
  }, [password, onPasswordChange]);

  // Prevent keyboard input of non-numeric characters
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if (
      [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ].includes(e.key)
    ) {
      return; // Allow these keys
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Block non-numeric keys
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  // Handle paste - only allow numeric characters
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const numericOnly = pastedText.replace(/\D/g, '').slice(0, MAX_PASSWORD_LENGTH);

      if (numericOnly) {
        setDisplayValue(numericOnly);
        onPasswordChange(numericOnly);
      }
    },
    [onPasswordChange],
  );

  return (
    <div
      css={styles}
      // style={{ display: 'none' }}
    >
      <div className="form-wrapper">
        <form className="form" onSubmit={onSubmit}>
          <div className="input-group">
            <label className="label" htmlFor="password">
              Password
              <span className="hint">4 digits</span>
            </label>
            <Input
              id="password"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={placeholderMask || getMaskedValue(displayValue)}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Enter 4-digit code"
              required
              disabled={isLoading}
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="off"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <NumericKeypad onDigitPress={handleDigitPress} onBackspace={handleBackspace} disabled={isLoading} />

          <Button
            type="submit"
            disabled={isLoading || password.length !== MAX_PASSWORD_LENGTH}
            size="md"
            color="info"
            className="submit-button"
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
