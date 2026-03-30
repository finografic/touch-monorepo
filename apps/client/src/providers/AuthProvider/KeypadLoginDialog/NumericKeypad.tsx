import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import { Button } from '@finografic/design-system/components';

import { keypadStyles } from './KeypadLoginDialog.styles';

interface NumericKeypadProps {
  onDigitPress: (digit: string) => void;
  disabled?: boolean;
  activeKey?: string;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigitPress,
  disabled = false,
  activeKey,
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeKey) {
      setPressedKey(activeKey);
      const timer = setTimeout(() => {
        setPressedKey(null);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setPressedKey(null);
    }
  }, [activeKey]);

  const handleKeyPress = (value: string) => {
    if (disabled) return;
    onDigitPress(value);
  };

  return (
    <div css={keypadStyles}>
      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
          const digitStr = digit.toString();
          const isActive = pressedKey === digitStr || pressedKey === `Numpad${digit}`;

          return (
            <Button
              key={digit}
              type="button"
              variant="outline"
              palette="default"
              size="lg"
              onClick={() => handleKeyPress(digitStr)}
              disabled={disabled}
              className={clsx('keypad-button', { 'keypad-button-active': isActive })}
            >
              {digit}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
