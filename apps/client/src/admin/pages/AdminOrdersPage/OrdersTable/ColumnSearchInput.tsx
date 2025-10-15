import { TextField } from '@radix-ui/themes';
import type { FC } from 'react';
import { MagnifyingGlassIcon } from 'styles/icons';
import { useDebouncedCallback } from 'use-debounce';

interface ColumnSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Lightweight search input for table column headers
 * Based on SearchBar but optimized for inline column filtering
 */
export const ColumnSearchInput: FC<ColumnSearchInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Search..',
}) => {
  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    onChange(newValue);
  }, 100);

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

