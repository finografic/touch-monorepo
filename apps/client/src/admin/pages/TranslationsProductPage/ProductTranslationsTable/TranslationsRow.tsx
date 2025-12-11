import { Controller, useFormContext } from 'react-hook-form';
import { colors } from 'styles';

interface TranslationsRowProps {
  index: number;
  remove: (index: number) => void;
}

export function TranslationsRow({ index, remove }: TranslationsRowProps) {
  const { control, formState } = useFormContext();
  const rowDirtyFields = formState.dirtyFields?.items?.[index];

  return (
    <tr>
      <td>
        <Controller
          name={`items.${index}.name`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              readOnly
              style={{
                color: rowDirtyFields?.name ? colors.warning : undefined,
              }}
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
              style={{
                color:
                  !field.value && rowDirtyFields?.esEs
                    ? colors.warning
                    : rowDirtyFields?.esEs
                      ? colors.warning
                      : undefined,
              }}
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
              style={{
                color:
                  !field.value && rowDirtyFields?.enGb
                    ? colors.warning
                    : rowDirtyFields?.enGb
                      ? colors.warning
                      : undefined,
              }}
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
              style={{
                color:
                  !field.value && rowDirtyFields?.caEs
                    ? colors.warning
                    : rowDirtyFields?.caEs
                      ? colors.warning
                      : undefined,
              }}
            />
          )}
        />
      </td>

      <td>
        <button type="button" onClick={() => remove(index)}>
          🗑
        </button>
      </td>
    </tr>
  );
}
