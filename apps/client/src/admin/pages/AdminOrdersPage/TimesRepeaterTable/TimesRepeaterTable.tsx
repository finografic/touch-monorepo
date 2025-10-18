import React, { useEffect } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import { ShuffleIcon } from '@radix-ui/react-icons';
import { Button, Text } from '@radix-ui/themes';
import { useDev } from 'dev-tools/providers/DevProvider';

import { DeleteIcon } from 'styles/icons';

import { InputTemperature } from '../../../../forms/InputTemperature';
import { InputTime } from '../../../../forms/InputTime';

import { styles } from './TimesRepeaterTable.styles';

interface TimeRowData {
  temperature?: number;
  timeA?: number;
  timeB?: number;
  timeC?: number;
}

interface TimesRepeaterTableProps {
  name: string;
  emptyRowValues: TimeRowData;
  minRows?: number;
  minVisibleRows?: number;
  language?: string;
  onCanAddRowChange?: (canAdd: boolean) => void; // Callback to notify parent when add state changes
  onGenerateRandomValues?: (rowIndex: number) => void; // External function to generate random values
}

export const TimesRepeaterTable: React.FC<TimesRepeaterTableProps> = ({
  name,
  emptyRowValues,
  minRows = 50,
  minVisibleRows = 4,
  language = 'es-ES',
  onCanAddRowChange,
  onGenerateRandomValues,
}) => {
  const { control, watch, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const formValues = watch();
  const timeRows = formValues[name] || [];
  const { isSubmitted } = formState;

  // Use dev tools visibility for random buttons
  const { isDevToolsVisible } = useDev();

  // Get defaultTempFreeze for minimum temperature constraint
  const defaultTempFreeze = formValues.defaultTempFreeze || -50;

  const isRowComplete = (index: number) => {
    const row = timeRows[index];
    return (
      row?.temperature !== undefined &&
      row?.timeA !== undefined &&
      row?.timeB !== undefined &&
      row?.timeC !== undefined
    );
  };

  const isRowValid = (index: number) => {
    const row = timeRows[index];
    if (!row) return false;

    // Check if all fields are present and within valid ranges
    const tempValid =
      typeof row.temperature === 'number' && row.temperature >= defaultTempFreeze && row.temperature <= 50;
    const timeAValid = typeof row.timeA === 'number' && row.timeA >= 0 && row.timeA <= 3600;
    const timeBValid = typeof row.timeB === 'number' && row.timeB >= 0 && row.timeB <= 3600;
    const timeCValid = typeof row.timeC === 'number' && row.timeC >= 0 && row.timeC <= 3600;

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

  // Check if first row field is empty and should show validation error
  const isFirstRowFieldRequired = (fieldName: string) => {
    return isSubmitted && (timeRows[0]?.[fieldName] === undefined || timeRows[0]?.[fieldName] === '');
  };

  const editableRowIndex = getEditableRowIndex();
  const canAddRow = editableRowIndex === -1; // All rows are complete and valid
  const canDeleteRow = fields.length > minRows;

  // Notify parent when canAddRow state changes
  useEffect(() => {
    if (onCanAddRowChange) {
      onCanAddRowChange(canAddRow);
    }
  }, [canAddRow, onCanAddRowChange]);

  // Calculate row height for scrolling (approximate height per row including gaps)
  const rowHeight = 60; // Estimated height per row in pixels
  const containerHeight = minVisibleRows * rowHeight + 16;

  // Calculate if internal add button should be hidden (when external callback is provided)
  const hideInternalAddButton = Boolean(onCanAddRowChange);

  return (
    <div css={styles} className="times-table">
      {/* Table Header */}
      <div className="table-header">
        <div className="header-column header-number"></div>
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
        <div className="header-column header-actions"></div>
      </div>

      {/* Scrollable Table Rows Container */}
      <div className="table-rows-container" style={{ height: `${containerHeight}px` }}>
        {fields.map((field, index) => {
          // A row is editable if:
          // 1. It's the current editable row (first incomplete/invalid), OR
          // 2. It's already complete and valid (for corrections)
          const isEditable = index === editableRowIndex || isRowCompleteAndValid(index);
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;

          // Validation classes for first row
          const tempValidationClass = isFirst && isFirstRowFieldRequired('temperature') ? 'field-error' : '';
          const timeAValidationClass = isFirst && isFirstRowFieldRequired('timeA') ? 'field-error' : '';
          const timeBValidationClass = isFirst && isFirstRowFieldRequired('timeB') ? 'field-error' : '';
          const timeCValidationClass = isFirst && isFirstRowFieldRequired('timeC') ? 'field-error' : '';

          return (
            <div
              key={field.id}
              className={`table-row ${isEditable ? 'row-editable' : 'row-disabled'} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
            >
              {/* Line number */}
              <div className="line-number-cell">
                <Text size="2" weight="bold" color="gray">
                  {index + 1}
                </Text>
              </div>

              <div className={`input-wrapper ${tempValidationClass}`}>
                <InputTemperature name={`${name}.${index}.temperature`} disabled={!isEditable} />
              </div>
              <div className={`input-wrapper ${timeAValidationClass}`}>
                <InputTime
                  name={`${name}.${index}.timeA`}
                  min={0}
                  max={3600}
                  step={30}
                  disabled={!isEditable}
                />
              </div>
              <div className={`input-wrapper ${timeBValidationClass}`}>
                <InputTime
                  name={`${name}.${index}.timeB`}
                  min={0}
                  max={3600}
                  step={30}
                  disabled={!isEditable}
                />
              </div>
              <div className={`input-wrapper ${timeCValidationClass}`}>
                <InputTime
                  name={`${name}.${index}.timeC`}
                  min={0}
                  max={3600}
                  step={30}
                  disabled={!isEditable}
                />
              </div>
              <div className="action-button-container">
                {/* Random values button - only show on editable rows */}
                {isDevToolsVisible &&
                  isEditable &&
                  !isRowCompleteAndValid(index) &&
                  onGenerateRandomValues && (
                    <Button
                      type="button"
                      variant="soft"
                      size="1"
                      color="gray"
                      onClick={() => onGenerateRandomValues?.(index)}
                      className="random-button"
                      title="Generate random values"
                    >
                      <ShuffleIcon style={{ height: '14px', width: '14px' }} />
                    </Button>
                  )}

                {/* Delete button */}
                {fields.length > 1 && isRowCompleteAndValid(index) && (
                  <Button
                    type="button"
                    variant="soft"
                    size="1"
                    color="red"
                    onClick={() => remove(index)}
                    className="delete-button"
                  >
                    <DeleteIcon />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Row Button - only show when all existing rows are complete AND no external callback is provided */}
      {canAddRow && !hideInternalAddButton && (
        <div className="add-row-container">
          <Button type="button" variant="soft" size="2" onClick={() => append(emptyRowValues)}>
            + Add Row
          </Button>
        </div>
      )}

      {/* Total rows counter */}
      <div className="table-footer">
        <div className="total-rows-counter">
          <Text size="2" weight="medium" color="gray">
            filas completas: {fields.length}
          </Text>
        </div>
      </div>
    </div>
  );
};
