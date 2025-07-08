import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@radix-ui/themes';
import { InputTemperature } from '../InputTemperature';
import { InputTime } from '../InputTime';
import { styles } from './TimesTableRepeater.styles';

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
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const formValues = watch();
  const timeRows = formValues[name] || [];

  const isRowComplete = (index: number) => {
    const row = timeRows[index];
    return (
      row?.temperature !== undefined &&
      row?.time_a !== undefined &&
      row?.time_b !== undefined &&
      row?.time_c !== undefined
    );
  };

  const getEditableRowIndex = () => {
    // Find first incomplete row
    for (let i = 0; i < fields.length; i++) {
      if (!isRowComplete(i)) {
        return i;
      }
    }
    return -1; // All rows complete
  };

  const editableRowIndex = getEditableRowIndex();
  const canAddRow = editableRowIndex === -1; // All rows are complete
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
        const isEditable = index === editableRowIndex || isRowComplete(index);
        const isEven = index % 2 === 0;
        const isFirst = index === 0;
        const isLast = index === fields.length - 1;

        return (
          <div
            key={field.id}
            className={`table-row ${isEven ? 'even' : 'odd'} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
          >
            <div className="input-wrapper">
              <InputTemperature
                {...register(`${name}.${index}.temperature`)}
                min={-50}
                max={50}
                step={0.5}
                defaultValue={timeRows[index]?.temperature}
                disabled={!isEditable}
              />
            </div>
            <div className="input-wrapper">
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
            <div className="input-wrapper">
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
            <div className="input-wrapper">
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
            <div className="delete-button-container">
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

      {/* Add Row Button */}
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
