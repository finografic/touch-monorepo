import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from 'components/Button';
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with password prop
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== password) {
      inputRef.current.value = password;
    }
  }, [password]);

  // Handle input change - only allow numbers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Only allow numeric characters
      const numericValue = inputValue.replace(/\D/g, '');

      // Limit to max length
      const trimmedValue = numericValue.slice(0, MAX_PASSWORD_LENGTH);

      // Update the password
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
      onPasswordChange(newValue);
    },
    [password, onPasswordChange],
  );

  // Handle backspace
  const handleBackspace = useCallback(() => {
    const newValue = password.slice(0, -1);
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
            <div className="password-input-wrapper">
              {/* Transparent input for actual value - allows keyboard input */}
              <input
                ref={inputRef}
                id="password"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={password}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Enter 4-digit code"
                required
                disabled={isLoading}
                maxLength={MAX_PASSWORD_LENGTH}
                autoComplete="off"
                className="password-input-overlay"
              />
              {/* Centered dots display */}
              <div className="password-display-mask">{'•'.repeat(password.length)}</div>
            </div>
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
