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
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('1')}
          disabled={disabled}
          className="keypad-button"
        >
          1
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('2')}
          disabled={disabled}
          className="keypad-button"
        >
          2
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('3')}
          disabled={disabled}
          className="keypad-button"
        >
          3
        </Button>

        {/* Row 2 */}
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('4')}
          disabled={disabled}
          className="keypad-button"
        >
          4
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('5')}
          disabled={disabled}
          className="keypad-button"
        >
          5
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('6')}
          disabled={disabled}
          className="keypad-button"
        >
          6
        </Button>

        {/* Row 3 */}
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('7')}
          disabled={disabled}
          className="keypad-button"
        >
          7
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('8')}
          disabled={disabled}
          className="keypad-button"
        >
          8
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('9')}
          disabled={disabled}
          className="keypad-button"
        >
          9
        </Button>

        {/* Row 4: *, 0, # */}
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={handleBackspace}
          disabled={disabled}
          className="keypad-button keypad-button-backspace"
          title="Backspace"
        >
          ⌫
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          onClick={() => handleKeyPress('0')}
          disabled={disabled}
          className="keypad-button"
        >
          0
        </Button>
        <Button
          type="button"
          variant="outline"
          color="default"
          size="lg"
          disabled={true}
          className="keypad-button keypad-button-empty"
          title="Reserved"
        >
          #
        </Button>
      </div>
    </div>
  );
};
