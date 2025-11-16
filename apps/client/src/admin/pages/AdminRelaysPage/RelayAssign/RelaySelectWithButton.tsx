import React from 'react';

import { SelectCustom } from 'forms/SelectCustom';
import { Button } from 'components/Button';

import type { SelectOption } from 'types/models/select-option.model';
import { RadioIcon } from 'styles/icons';
import { styles } from './RelaySelectWithButton.styles';

interface RelaySelectWithButtonProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  allowEmpty?: boolean;
  disabled?: boolean;
  slotNumber: number;
}

/**
 * Relay selection control with button using PrimeReact InputGroup pattern
 * Button on left triggers action, dropdown on right for relay selection
 */
export const RelaySelectWithButton: React.FC<RelaySelectWithButtonProps> = ({
  options,
  value,
  placeholder = 'Please select...',
  onSelect,
  allowEmpty = true,
  disabled = false,
  slotNumber,
}) => {
  const handleButtonClick = () => {
    const currentSelection = value ? `Relay ${value}` : 'No relay selected';
    log('[RELAY TEST]:', 'lime', slotNumber);
  };

  return (
    <div className="inputgroup" css={styles}>
      {/* <div className="inputgroup-button-container"> */}
      <Button
        className="inputgroup-button"
        onClick={handleButtonClick}
        variant="solid"
        color="info"
        size="md"
        disabled={disabled}
      >
        <RadioIcon /> test
      </Button>
      {/* </div> */}
      {/* <div className="inputgroup-select-container"> */}
      <SelectCustom
        className="inputgroup-select"
        options={options}
        value={value}
        placeholder={placeholder}
        onSelect={onSelect}
        allowEmpty={allowEmpty}
        disabled={disabled}
      />
      {/* </div> */}
    </div>
  );
};
