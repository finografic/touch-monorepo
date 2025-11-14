import React from 'react';
import type { FieldArrayWithId } from 'react-hook-form';

import { ShuffleIcon } from '@radix-ui/react-icons';
import { Text } from '@radix-ui/themes';
import { InputTime } from 'forms/InputTime';
import { TemperatureInputField } from 'forms/TemperatureInputField';
import { Button } from 'components/Button';

import { DeleteIcon } from 'styles/icons';
import { styles } from './RepeaterTableRow.styles';

interface TimeRowData {
  temperature?: number;
  timeA?: number;
  timeB?: number;
  timeC?: number;
}

interface RepeaterTableRowProps {
  field: FieldArrayWithId<any, string, 'id'>;
  index: number;
  name: string;
  language: string;
  defaultTempFreeze: number;
  isEditable: boolean;
  isFirst: boolean;
  isLast: boolean;
  isRowCompleteAndValid: (index: number) => boolean;
  isFirstRowFieldRequired: (fieldName: string) => boolean;
  onGenerateRandomValues?: (index: number) => void;
  onRemove: (index: number) => void;
  isDevToolsVisible: boolean;
  canDelete: boolean;
}

export const RepeaterTableRow: React.FC<RepeaterTableRowProps> = ({
  field,
  index,
  name,
  language,
  defaultTempFreeze,
  isEditable,
  isFirst,
  isLast,
  isRowCompleteAndValid,
  isFirstRowFieldRequired,
  onGenerateRandomValues,
  onRemove,
  isDevToolsVisible,
  canDelete,
}) => {
  // Validation classes for first row
  const tempValidationClass = isFirst && isFirstRowFieldRequired('temperature') ? 'field-error' : '';
  const timeAValidationClass = isFirst && isFirstRowFieldRequired('timeA') ? 'field-error' : '';
  const timeBValidationClass = isFirst && isFirstRowFieldRequired('timeB') ? 'field-error' : '';
  const timeCValidationClass = isFirst && isFirstRowFieldRequired('timeC') ? 'field-error' : '';

  return (
    <div
      css={styles}
      key={field.id}
      className={`table-row ${isEditable ? 'row-editable' : 'row-disabled'} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
    >
      {/* Line number */}
      <div className="line-number-cell">
        <Text size="2" weight="bold" color="gray">
          {index + 1}
        </Text>
      </div>

      {/* Temperature input */}
      <div className={`input-wrapper ${tempValidationClass}`}>
        <TemperatureInputField
          name={`${name}.${index}.temperature`}
          locale={language}
          min={defaultTempFreeze}
          max={50}
          disabled={!isEditable}
        />
      </div>

      {/* Time A input */}
      <div className={`input-wrapper ${timeAValidationClass}`}>
        <InputTime name={`${name}.${index}.timeA`} min={0} max={3600} step={30} disabled={!isEditable} />
      </div>

      {/* Time B input */}
      <div className={`input-wrapper ${timeBValidationClass}`}>
        <InputTime name={`${name}.${index}.timeB`} min={0} max={3600} step={30} disabled={!isEditable} />
      </div>

      {/* Time C input */}
      <div className={`input-wrapper ${timeCValidationClass}`}>
        <InputTime name={`${name}.${index}.timeC`} min={0} max={3600} step={30} disabled={!isEditable} />
      </div>

      {/* Actions */}
      <div className="rows-actions-container">
        {/* Random values button - only show on editable rows */}
        {isDevToolsVisible && isEditable && !isRowCompleteAndValid(index) && onGenerateRandomValues && (
          <Button
            type="button"
            variant="outline"
            // variant="ghost"
            size="md"
            color="info"
            onClick={() => onGenerateRandomValues(index)}
            className="random-button"
            title="Generate random values"
          >
            <ShuffleIcon style={{ height: '14px', width: '14px' }} />
          </Button>
        )}

        {/* Delete button */}
        {canDelete && isRowCompleteAndValid(index) && (
          <Button
            type="button"
            variant="outline"
            // variant="ghost"
            size="md"
            color="danger"
            onClick={() => onRemove(index)}
            className="button-delete"
          >
            <DeleteIcon />
          </Button>
        )}
      </div>
    </div>
  );
};
