import type { FC } from 'react';

import { TextField } from '@radix-ui/themes';
import { SelectSearchable } from 'forms/SelectSearchable';
import { useDebouncedCallback } from 'use-debounce';

import type { SelectOption } from 'types/models/select-option.model';

import { MagnifyingGlassIcon } from 'styles/icons';

interface ColumnFilterBaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasIcon?: boolean;
  width?: string;
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
  hasIcon = true,
  width = '100%',
}) => {
  // Small debounce to avoid excessive filter recalcs while typing rapidly
  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    onChange(newValue);
  }, 75);

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
      size="1"
      variant="soft"
      style={{ width }}
      placeholder={placeholder}
      value={value}
      onChange={(evt) => debouncedOnChange(evt.target.value)}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter') {
          const target = evt.target as HTMLElement;
          const form = target.closest('form');
          if (form) {
            if (typeof (form as HTMLFormElement).requestSubmit === 'function') {
              (form as HTMLFormElement).requestSubmit();
            } else {
              const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]') as
                | HTMLButtonElement
                | HTMLInputElement
                | null;
              submitBtn?.click();
            }
          }
        }
      }}
    >
      {hasIcon && (
        <TextField.Slot>
          <MagnifyingGlassIcon height="12" width="12" />
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

/**
 * @deprecated Use ColumnFilter instead
 */
export const ColumnSearchInput = ColumnFilter;
