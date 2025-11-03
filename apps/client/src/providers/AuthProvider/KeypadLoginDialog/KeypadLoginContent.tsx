import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KEY_PRESS } from '@workspace/core';
import { useKeyPress } from '@workspace/core/hooks';

import clsx from 'clsx';
import { Button } from 'components/Button';

import { NumericKeypad } from './NumericKeypad';
import { styles } from './KeypadLoginDialog.styles';

interface KeypadLoginTabContentProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

const MAX_PASSWORD_LENGTH = 12;

/**
 * Keypad login tab content with numeric keypad input
 * Only accepts numeric input, max 4 digits
 */
export const KeypadLoginTabContent: React.FC<KeypadLoginTabContentProps> = ({
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [showMaxLengthWarning, setShowMaxLengthWarning] = useState(false);

  // Handle keypad digit press
  const handleDigitPress = useCallback(
    (digit: string) => {
      console.log(digit);
      if (password.length >= MAX_PASSWORD_LENGTH) {
        // Show warning when trying to add digit at max length
        setShowMaxLengthWarning(true);
        // Clear warning after 100ms
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
        warningTimeoutRef.current = setTimeout(() => {
          setShowMaxLengthWarning(false);
          warningTimeoutRef.current = null;
        }, 100);
        return;
      }

      const newValue = password + digit;
      onPasswordChange(newValue);
    },
    [password, onPasswordChange],
  );

  const handleBackspace = useCallback(() => {
    const newValue = password.slice(0, -1);
    onPasswordChange(newValue);
  }, [password, onPasswordChange]);

  const handleEnter = useCallback(
    (_keyValue?: string) => {
      console.log('handleEnter', _keyValue);
      if (!isLoading) {
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

  const handleKeyPressFeedback = useCallback((keyValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setActiveKey(keyValue);
    timeoutRef.current = setTimeout(() => {
      setActiveKey(undefined);
      timeoutRef.current = null;
    }, 100);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

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
    onKeyPress: handleKeyPressFeedback,
  });

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
                defaultValue={password}
                placeholder="Enter password"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value)}
                disabled={isLoading}
                maxLength={MAX_PASSWORD_LENGTH}
                autoComplete="off"
                className={clsx(
                  'password-input-overlay',
                  password.length > 0 && 'input-filled',
                  showMaxLengthWarning && 'input-max-length-warning',
                  error && 'input-error',
                )}
                aria-invalid={error ? 'true' : 'false'}
              />
              <div className="password-display-mask">{'•'.repeat(password.length)}</div>
            </div>
          </div>

          <NumericKeypad onDigitPress={handleDigitPress} disabled={isLoading} activeKey={activeKey} />

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
