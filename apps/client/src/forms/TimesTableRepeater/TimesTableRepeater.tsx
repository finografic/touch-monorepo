import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@radix-ui/themes';
import { ShuffleIcon } from '@radix-ui/react-icons';
import { InputTemperature } from '../InputTemperature';
import { InputTime } from '../InputTime';
import { styles } from './TimesTableRepeater.styles';
import { useDev } from 'providers/DevProvider';

interface TimeRowData {
  temperature?: number;
  time_a?: number;
  time_b?: number;
  time_c?: number;
}

interface TimesTableRepeaterProps {
  name: string;
  emptyRowValues: TimeRowData;
  minRows?: number;
}

export const TimesTableRepeater: React.FC<TimesTableRepeaterProps> = ({
  name,
  emptyRowValues,
  minRows = 4,
}) => {
  const { control, register, setValue, watch, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const formValues = watch();
  const timeRows = formValues[name] || [];
  const { isSubmitted } = formState;

  // ======================================================================== //
  // TODO: DEV-ONLY - REMOVE
  const { isDevToolsVisible } = useDev();

  // ======================================================================== //

  // Get defaultTempFreeze for minimum temperature constraint
  const defaultTempFreeze = formValues.defaultTempFreeze || -50;

  const isRowComplete = (index: number) => {
    const row = timeRows[index];
    return (
      row?.temperature !== undefined &&
      row?.time_a !== undefined &&
      row?.time_b !== undefined &&
      row?.time_c !== undefined
    );
  };

  const isRowValid = (index: number) => {
    const row = timeRows[index];
    if (!row) return false;

    // Check if all fields are present and within valid ranges
    const tempValid =
      typeof row.temperature === 'number' && row.temperature >= defaultTempFreeze && row.temperature <= 50;

    const timeAValid = typeof row.time_a === 'number' && row.time_a >= 0 && row.time_a <= 3600;

    const timeBValid = typeof row.time_b === 'number' && row.time_b >= 0 && row.time_b <= 3600;

    const timeCValid = typeof row.time_c === 'number' && row.time_c >= 0 && row.time_c <= 3600;

    return tempValid && timeAValid && timeBValid && timeCValid;
  };

  const isRowCompleteAndValid = (index: number) => {
    return isRowComplete(index) && isRowValid(index);
  };

  const getEditableRowIndex = () => {
    // First row is always editable
    if (fields.length === 0) return 0;

    // Check each row sequentially
    for (let i = 0; i < fields.length; i++) {
      if (!isRowCompleteAndValid(i)) {
        return i; // This is the first incomplete/invalid row, so it's editable
      }
    }
    return -1; // All rows complete and valid
  };

  // Generate reasonable random values
  const generateRandomValues = (rowIndex: number) => {
    // Random temperature between defaultTempFreeze and 50°C
    const randomTemp = Math.round((Math.random() * (50 - defaultTempFreeze) + defaultTempFreeze) * 2) / 2; // Round to 0.5

    // Random times between 30 seconds and 30 minutes (1800 seconds)
    const generateRandomTime = () => {
      const minTime = 30; // 30 seconds minimum
      const maxTime = 1800; // 30 minutes maximum
      const randomSeconds = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
      // Round to nearest 30 seconds
      return Math.round(randomSeconds / 30) * 30;
    };

    const randomTimeA = generateRandomTime();
    const randomTimeB = generateRandomTime();
    const randomTimeC = generateRandomTime();

    // Set all values for this row
    setValue(`${name}.${rowIndex}.temperature`, randomTemp, { shouldValidate: true });
    setValue(`${name}.${rowIndex}.time_a`, randomTimeA, { shouldValidate: true });
    setValue(`${name}.${rowIndex}.time_b`, randomTimeB, { shouldValidate: true });
    setValue(`${name}.${rowIndex}.time_c`, randomTimeC, { shouldValidate: true });
  };

  // Check if first row field is empty and should show validation error
  const isFirstRowFieldRequired = (fieldName: string) => {
    return isSubmitted && (timeRows[0]?.[fieldName] === undefined || timeRows[0]?.[fieldName] === '');
  };

  const editableRowIndex = getEditableRowIndex();
  const canAddRow = editableRowIndex === -1; // All rows are complete and valid
  const canDeleteRow = fields.length > minRows;

  return (
    <div css={styles} className="times-table">
      {/* Table Header */}
      <div className="table-header">
        <div className="header-column">Temperature</div>
        <div className="header-column">
          Time A <span>mm:ss</span>
        </div>
        <div className="header-column">
          Time B <span>mm:ss</span>
        </div>
        <div className="header-column">
          Time C <span>mm:ss</span>
        </div>
        <div className="header-actions"></div>
      </div>

      {/* Table Rows */}
      {fields.map((field, index) => {
        // A row is editable if:
        // 1. It's the current editable row (first incomplete/invalid), OR
        // 2. It's already complete and valid (for corrections)
        const isEditable = index === editableRowIndex || isRowCompleteAndValid(index);

        const isFirst = index === 0;
        const isLast = index === fields.length - 1;

        // Validation classes for first row
        const tempValidationClass = isFirst && isFirstRowFieldRequired('temperature') ? 'field-error' : '';
        const timeAValidationClass = isFirst && isFirstRowFieldRequired('time_a') ? 'field-error' : '';
        const timeBValidationClass = isFirst && isFirstRowFieldRequired('time_b') ? 'field-error' : '';
        const timeCValidationClass = isFirst && isFirstRowFieldRequired('time_c') ? 'field-error' : '';

        return (
          <div
            key={field.id}
            className={`table-row ${isEditable ? 'row-editable' : 'row-disabled'} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
          >
            <div className={`input-wrapper ${tempValidationClass}`}>
              <InputTemperature
                {...register(`${name}.${index}.temperature`)}
                min={defaultTempFreeze}
                max={50}
                step={0.5}
                defaultValue={timeRows[index]?.temperature}
                disabled={!isEditable}
              />
            </div>
            <div className={`input-wrapper ${timeAValidationClass}`}>
              <InputTime
                value={timeRows[index]?.time_a}
                min={0}
                max={3600}
                step={30}
                onTimeChange={(seconds) => {
                  setValue(`${name}.${index}.time_a`, seconds, { shouldValidate: true });
                }}
                disabled={!isEditable}
              />
            </div>
            <div className={`input-wrapper ${timeBValidationClass}`}>
              <InputTime
                value={timeRows[index]?.time_b}
                min={0}
                max={3600}
                step={30}
                onTimeChange={(seconds) => {
                  setValue(`${name}.${index}.time_b`, seconds, { shouldValidate: true });
                }}
                disabled={!isEditable}
              />
            </div>
            <div className={`input-wrapper ${timeCValidationClass}`}>
              <InputTime
                value={timeRows[index]?.time_c}
                min={0}
                max={3600}
                step={30}
                onTimeChange={(seconds) => {
                  setValue(`${name}.${index}.time_c`, seconds, { shouldValidate: true });
                }}
                disabled={!isEditable}
              />
            </div>
            <div className="action-button-container">
              {/* Random values button - only show on editable rows */}
              {isDevToolsVisible && isEditable && (
                <Button
                  type="button"
                  variant="soft"
                  size="1"
                  color="gray"
                  onClick={() => generateRandomValues(index)}
                  className="random-button"
                  title="Generate random values"
                >
                  <ShuffleIcon style={{ height: '14px', width: '14px' }} />
                </Button>
              )}

              {/* Delete button */}
              {canDeleteRow && (
                <Button
                  type="button"
                  variant="ghost"
                  size="1"
                  color="red"
                  onClick={() => remove(index)}
                  className="delete-button"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Row Button - only show when all existing rows are complete */}
      {canAddRow && (
        <div className="add-row-container">
          <Button type="button" variant="soft" size="2" onClick={() => append(emptyRowValues)}>
            + Add Row
          </Button>
        </div>
      )}
    </div>
  );
};
