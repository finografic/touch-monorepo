import type { FC } from 'react';

import { TextField } from '@radix-ui/themes';
import { SelectSearchable } from 'forms/SelectSearchable';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from 'styles/icons';
import type { SelectOption } from 'types/models/select-option.model';

interface ColumnFilterBaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ColumnFilterSearchProps extends ColumnFilterBaseProps {
  variant: 'search';
  options?: never;
}

interface ColumnFilterSelectProps extends ColumnFilterBaseProps {
  variant: 'select';
  options: SelectOption[];
}

export type ColumnFilterProps = ColumnFilterSearchProps | ColumnFilterSelectProps;

/**
 * Column filter component for table headers
 * Supports two variants:
 * - 'search': Text input with fuzzy search (default)
 * - 'select': Searchable dropdown with predefined options
 */
export const ColumnFilter: FC<ColumnFilterProps> = ({
  value = '',
  onChange,
  placeholder = 'Search..',
  variant = 'search',
  options,
}) => {
  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    onChange(newValue);
  }, 100);

  // Render select variant
  if (variant === 'select' && options) {
    return (
      <div style={{ width: '100%' }}>
        <SelectSearchable
          options={options}
          value={value}
          onSelect={onChange}
          onClear={() => onChange('')}
          placeholder={placeholder}
          allowAddNew={false}
          windowSize={10}
        />
      </div>
    );
  }

  // Render search variant (default)
  return (
    <TextField.Root
      className="column-search-input"
      placeholder={placeholder}
      value={value}
      onChange={(evt) => debouncedOnChange(evt.target.value)}
      size="1"
      variant="soft"
      style={{ width: '100%' }}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="12" width="12" />
      </TextField.Slot>
    </TextField.Root>
  );
};

/**
 * @deprecated Use ColumnFilter instead
 */
export const ColumnSearchInput = ColumnFilter;
