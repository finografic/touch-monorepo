import type { FC } from 'react';

import { InputField } from '@workspace/design-system/forms';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from '@workspace/icons';
import { styles } from './SearchBar.styles';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status?: 'active' | 'inactive';
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchTerm = '',
  onSearchChange,
  status,
  placeholder = 'Search..',
}) => {
  const debouncedOnSearchChange = useDebouncedCallback((value: string) => {
    onSearchChange(value);
  }, 100);

  return (
    <div css={styles} role="searchbox" className={clsx('search-bar', status)}>
      <InputField.Root
        placeholder={placeholder}
        value={searchTerm}
        onChange={(evt) => debouncedOnSearchChange(evt.target.value)}
      >
        <InputField.Slot side="left">
          <MagnifyingGlassIcon />
        </InputField.Slot>
      </InputField.Root>
    </div>
  );
};
