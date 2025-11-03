import React from 'react';

import { Button } from 'components/Button';

import { keypadStyles } from './KeypadLoginDialog.styles';

interface NumericKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

/**
 * 3x4 Numeric Keypad Component
 * Standard phone keypad layout:
 *   1  2  3
 *   4  5  6
 *   7  8  9
 *   0  #
 */
export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigitPress,
  onBackspace,
  disabled = false,
}) => {
  const handleKeyPress = (value: string) => {
    if (disabled) return;
    onDigitPress(value);
  };

  const handleBackspace = () => {
    if (disabled) return;
    onBackspace();
  };

  return (
    <div css={keypadStyles}>
      <div className="keypad-grid">
        {/* Row 1 */}
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
