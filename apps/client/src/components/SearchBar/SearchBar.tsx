import { Flex, TextField } from '@radix-ui/themes';
import { styles } from './SearchBar.styles';
import type { FC } from 'react';
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

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
  return (
    <div css={styles} role="searchbox" className={clsx('search-bar', status)}>
      <Flex align="center" gap="3">
        <TextField.Root
          placeholder={placeholder}
          value={searchTerm}
          onChange={(evt) => onSearchChange(evt.target.value)}
          size="3"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </Flex>
    </div>
  );
};
