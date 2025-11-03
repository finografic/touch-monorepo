import React from 'react';

import { Button } from 'components/Button';

import { keypadStyles } from './KeypadLoginDialog.styles';

interface NumericKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ onDigitPress, disabled = false }) => {
  const handleKeyPress = (value: string) => {
    if (disabled) return;
    onDigitPress(value);
  };

  return (
    <div css={keypadStyles}>
      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            type="button"
            variant="outline"
            color="default"
            size="lg"
            onClick={() => handleKeyPress(digit.toString())}
            disabled={disabled}
            className="keypad-button"
          >
            {digit}
          </Button>
        ))}
      </div>
    </div>
  );
};
