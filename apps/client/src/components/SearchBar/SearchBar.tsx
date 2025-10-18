import { Flex, TextField } from '@radix-ui/themes';
import clsx from 'clsx';
import type { FC } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from 'styles/icons';

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
      <Flex align="center" gap="3">
        <TextField.Root
          className="input-search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(evt) => debouncedOnSearchChange(evt.target.value)}
          size="3"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
        </TextField.Root>
      </Flex>
    </div>
  );
};
