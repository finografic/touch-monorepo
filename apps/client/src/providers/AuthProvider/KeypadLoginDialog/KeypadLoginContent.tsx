import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KEY_PRESS } from '@workspace/core';

import clsx from 'clsx';
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
      if (password.length >= MAX_PASSWORD_LENGTH) return;

      const newValue = password + digit;
      onPasswordChange(newValue);
    },
    [password, onPasswordChange],
  );

  // Handle backspace (also handles Delete key)
  const handleBackspace = useCallback(() => {
    const newValue = password.slice(0, -1);
    onPasswordChange(newValue);
  }, [password, onPasswordChange]);

  // Handle Enter key - submit form if password is complete
  const handleEnter = useCallback(
    (_keyValue?: string) => {
      if (password.length === MAX_PASSWORD_LENGTH && !isLoading) {
        // Find the form and submit button
        const form = inputRef.current?.closest('form');
        const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (form && submitButton && !submitButton.disabled) {
          // Trigger form submission by clicking the submit button
          // This ensures all form validation and handlers run properly
          submitButton.click();
        }
      }
    },
    [password, isLoading],
  );

  // Keyboard input handler - listens for numeric keys, backspace, delete, and enter
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
      [KEY_PRESS.ENTER, handleEnter],
    ],
    isActive: true,
  });

  // Sync input value with password prop
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== password) {
      inputRef.current.value = password;
    }
  }, [password]);

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
                className={clsx('password-input-overlay', password.length > 0 && 'input-filled')}
                aria-invalid={error ? 'true' : 'false'}
              />
              {/* Centered dots display */}
              <div className="password-display-mask">{'•'.repeat(password.length)}</div>
            </div>
          </div>

          <NumericKeypad onDigitPress={handleDigitPress} onBackspace={handleBackspace} disabled={isLoading} />

          <Button
            type="submit"
            disabled={isLoading || password.length === 0}
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
