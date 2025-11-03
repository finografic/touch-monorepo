import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KEY_PRESS } from '@workspace/core';

import { Button } from 'components/Button';
import { useAuth } from 'providers/AuthProvider';

import { NumericKeypad } from './NumericKeypad';
import { useKeyPress } from './useKeyPress';
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Keyboard input handler - listens for numeric keys and backspace
  useKeyPress({
    key: [
      [KEY_PRESS.DIGIT_0, handleDigitPress],
      [KEY_PRESS.DIGIT_1, handleDigitPress],
      [KEY_PRESS.DIGIT_2, handleDigitPress],
      [KEY_PRESS.DIGIT_3, handleDigitPress],
      [KEY_PRESS.DIGIT_4, handleDigitPress],
      [KEY_PRESS.DIGIT_5, handleDigitPress],
      [KEY_PRESS.DIGIT_6, handleDigitPress],
      [KEY_PRESS.DIGIT_7, handleDigitPress],
      [KEY_PRESS.DIGIT_8, handleDigitPress],
      [KEY_PRESS.DIGIT_9, handleDigitPress],
      [KEY_PRESS.BACKSPACE, handleBackspace],
    ],
    isActive: true,
  });

  // Sync input value with password prop
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== password) {
      inputRef.current.value = password;
    }
  }, [password]);

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
    <div css={styles}>
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
                // onChange={handleInputChange}
                // onKeyDown={handleKeyDown}
                // onPaste={handlePaste}
                placeholder="Enter 4-digit code"
                required
                disabled={isLoading}
                maxLength={MAX_PASSWORD_LENGTH}
                autoComplete="off"
                className="password-input-overlay"
                // aria-invalid={error ? 'true' : 'false'}
                aria-invalid={password.length > 0}
              />
              {/* Centered dots display */}
              <div className="password-display-mask">{'•'.repeat(password.length)}</div>
            </div>
          </div>

          {/* {error && <div className="error">{error}</div>} */}

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
