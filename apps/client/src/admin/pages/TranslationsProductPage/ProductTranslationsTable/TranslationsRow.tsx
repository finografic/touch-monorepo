import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from '@radix-ui/react-icons';
import { Button } from 'components/Button';

interface TranslationsRowProps {
  index: number;
  remove: (index: number) => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
}

export function TranslationsRow({ index, remove, isEditing, onEditingChange }: TranslationsRowProps) {
  const { control, formState, watch } = useFormContext();

  const rowDirtyFields = formState.dirtyFields?.items?.[index];
  const rowValues = watch(`items.${index}`);

  // Check if row is empty (no language values)
  const isEmpty = !rowValues?.esEs && !rowValues?.enGb && !rowValues?.caEs;

  // Check if row has any changes
  const isDirty = Boolean(rowDirtyFields);

  // Build dynamic class names using clsx
  const rowClasses = clsx({
    'row-editing': isEditing,
    'row-dirty': isDirty,
    'row-empty': isEmpty,
  });

  return (
    <tr
      className={rowClasses}
      onFocus={() => onEditingChange(true)}
      onBlur={(e) => {
        // Only blur if focus is leaving the entire row
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onEditingChange(false);
        }
      }}
    >
      <td className="col-key">
        <Controller
          name={`items.${index}.name`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              readOnly
              className={clsx({
                'input-dirty': rowDirtyFields?.name,
              })}
            />
          )}
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.esEs`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="-"
              className={clsx({
                'input-dirty': rowDirtyFields?.esEs,
                'input-empty': !field.value,
              })}
            />
          )}
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.enGb`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="-"
              className={clsx({
                'input-dirty': rowDirtyFields?.enGb,
                'input-empty': !field.value,
              })}
            />
          )}
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.caEs`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="-"
              className={clsx({
                'input-dirty': rowDirtyFields?.caEs,
                'input-empty': !field.value,
              })}
            />
          )}
        />
      </td>

      <td>
        <Button
          className="button button-delete"
          aria-label="Delete"
          variant="ghost"
          size="md"
          color="danger"
          onClick={() => remove(index)}
        >
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
}
