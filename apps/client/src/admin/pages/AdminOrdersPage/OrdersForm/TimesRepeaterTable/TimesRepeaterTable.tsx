import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from 'components/Button';

import { useDev } from 'dev-tools/providers/DevProvider';
import { RepeaterTableRow } from './RepeatersTableRow/RepeaterTableRow';
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
  language?: string;
  onCanAddRowChange?: (canAdd: boolean) => void; // Callback to notify parent when add state changes
  onGenerateRandomValues?: (rowIndex: number) => void; // External function to generate random values
}

export const TimesRepeaterTable: React.FC<TimesRepeaterTableProps> = ({
  name,
  emptyRowValues,
  minRows = 15,
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

  const { isDevToolsVisible } = useDev();
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
    if (fields.length === 0) return 0;

    for (let i = 0; i < fields.length; i++) {
      if (!isRowCompleteAndValid(i)) {
        return i; // This is the first incomplete/invalid row, so it's editable
      }
    }

    return -1; // All rows complete and valid
  };

  const isFirstRowFieldRequired = (fieldName: string) => {
    return isSubmitted && (timeRows[0]?.[fieldName] === undefined || timeRows[0]?.[fieldName] === '');
  };

  const editableRowIndex = getEditableRowIndex();
  const canAddRow = editableRowIndex === -1; // All rows are complete and valid
  const canDeleteRow = fields.length > minRows;

  useEffect(
    function handleCanAddRowChange() {
      if (onCanAddRowChange) {
        onCanAddRowChange(canAddRow);
      }
    },
    [canAddRow, onCanAddRowChange],
  );

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

      {/* Table Rows Container - Full height, no scrolling */}
      <div className="table-rows-container">
        {fields.map((field, index) => {
          // A row is editable if:
          // 1. It's the current editable row (first incomplete/invalid), OR
          // 2. It's already complete and valid (for corrections)
          const isEditable = index === editableRowIndex || isRowCompleteAndValid(index);
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;

          return (
            <RepeaterTableRow
              key={field.id}
              field={field}
              index={index}
              name={name}
              language={language}
              defaultTempFreeze={defaultTempFreeze}
              isEditable={isEditable}
              isFirst={isFirst}
              isLast={isLast}
              isRowCompleteAndValid={isRowCompleteAndValid}
              isFirstRowFieldRequired={isFirstRowFieldRequired}
              onGenerateRandomValues={onGenerateRandomValues}
              onRemove={remove}
              isDevToolsVisible={isDevToolsVisible}
              canDelete={fields.length > 1}
              // canDelete={canDeleteRow}
            />
          );
        })}
      </div>

      {/* Total rows counter */}
      <div className="table-footer">
        {/* Add Row Button - only show when all existing rows are complete AND no external callback is provided */}
        <div className="add-row-container">
          <Button
            type="button"
            className="button-success"
            onClick={() => append(emptyRowValues)}
            disabled={!canAddRow}
            color="success"
            variant="outline"
          >
            + Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};
