import { Controller, useFormContext } from 'react-hook-form';
import { colors } from 'styles';

interface TranslationsRowProps {
  index: number;
  remove: (index: number) => void;
}

export function TranslationsRow({ index, remove }: TranslationsRowProps) {
  const { control, formState } = useFormContext();
  const isDirty = formState.dirtyFields?.items?.[index];

  return (
    <tr className={isDirty ? colors.warning : ''}>
      <td>
        <Controller
          name={`items.${index}.name`}
          control={control}
          render={({ field }) => <input {...field} readOnly />}
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.esEs`}
          control={control}
          render={({ field }) => <input {...field} placeholder="-" />}
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.enGb`}
          control={control}
          render={({ field }) => <input {...field} placeholder="-" />}
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.caEs`}
          control={control}
          render={({ field }) => <input {...field} placeholder="-" />}
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
