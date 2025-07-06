import React, { useEffect, useMemo, useRef, useState } from 'react';
import { matchSorter } from 'match-sorter';
import { Box, Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { styles } from './SearchableSelect.styles';
import type { SelectOption } from 'types/models/select-option.model';

interface SearchableSelectProps {
  options: SelectOption[];
  onSelect: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  windowSize?: number;
  allowAddNew?: boolean;
  label?: string;
  required?: boolean;
  value?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onSelect,
  onAddNew,
  placeholder = 'Type to search or add new...',
  disabled = false,
  windowSize = 20,
  allowAddNew = true,
  label,
  required = false,
  value = '',
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [displayStart, setDisplayStart] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with external value changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Use match-sorter for intelligent search
  const allFilteredOptions = useMemo(() => {
    if (!searchValue.trim()) {
      return options;
    }

    return matchSorter(options, searchValue, {
      keys: ['value', 'label', 'description', 'category'],
      threshold: matchSorter.rankings.CONTAINS,
    });
  }, [options, searchValue]);

  // Check if current input matches any existing option
  const exactMatch = useMemo(() => {
    return options.find(
      (option) =>
        option.value.toLowerCase() === searchValue.toLowerCase() ||
        option.label.toLowerCase() === searchValue.toLowerCase(),
    );
  }, [options, searchValue]);

  // Simple sliding window
  const slidingWindow = useMemo(() => {
    const totalItems = allFilteredOptions.length;
    if (totalItems === 0) return { items: [], startIndex: 0, endIndex: 0, totalItems: 0 };

    const endIndex = Math.min(totalItems, displayStart + windowSize);

    return {
      items: allFilteredOptions.slice(displayStart, endIndex),
      startIndex: displayStart,
      endIndex,
      totalItems,
    };
  }, [allFilteredOptions, displayStart, windowSize]);

  const handleSelectOption = (option: SelectOption) => {
    onSelect(option.value);
    setSearchValue(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    setDisplayStart(0);
    setLastScrollTop(0);
    inputRef.current?.blur();
  };

  const handleAddNew = () => {
    if (searchValue.trim() && onAddNew && !exactMatch) {
      onAddNew(searchValue.trim());
      onSelect(searchValue.trim());
      setIsOpen(false);
      setFocusedIndex(-1);
      setDisplayStart(0);
      setLastScrollTop(0);
      inputRef.current?.blur();
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setDisplayStart(0);
    setLastScrollTop(0);
    if (slidingWindow.items.length > 0) {
      setFocusedIndex(0);
    }
  };

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    onSelect(newValue);
    setIsOpen(newValue.length > 0 || options.length > 0);
  };

  // Bidirectional scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const isNearTop = scrollTop <= 10;

    const isScrollingDown = scrollTop > lastScrollTop;
    const isScrollingUp = scrollTop < lastScrollTop;

    setLastScrollTop(scrollTop);

    if (isScrollingDown && isNearBottom && slidingWindow.endIndex < allFilteredOptions.length) {
      setDisplayStart((prev) => Math.min(prev + 10, Math.max(0, allFilteredOptions.length - windowSize)));
    }

    if (isScrollingUp && isNearTop && slidingWindow.startIndex > 0) {
      setDisplayStart((prev) => Math.max(0, prev - 10));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
      }
      return;
    }

    // Calculate total items including "Add New" option
    const totalItems =
      slidingWindow.items.length + (allowAddNew && searchValue.trim() && !exactMatch ? 1 : 0);

    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        e.preventDefault();
        break;
      case 'Enter':
        if (focusedIndex >= 0) {
          if (focusedIndex < slidingWindow.items.length) {
            handleSelectOption(slidingWindow.items[focusedIndex]);
          } else if (allowAddNew && searchValue.trim() && !exactMatch) {
            handleAddNew();
          }
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        setDisplayStart(0);
        setLastScrollTop(0);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
        setDisplayStart(0);
        setLastScrollTop(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box style={{ position: 'relative', minWidth: '180px' }}>
      {label && (
        <Text size="2" mb="2" weight="medium">
          {label} {required && '*'}
        </Text>
      )}

      <div css={styles} className="searchable-select">
        <Box className="search-container" style={{ position: 'relative' }}>
          <TextField.Root
            ref={inputRef}
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputClick}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            size="3"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" style={{ marginLeft: '6px' }} />
            </TextField.Slot>
            <TextField.Slot>
              <ChevronDownIcon
                height="16"
                width="16"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  marginRight: '8px',
                }}
              />
            </TextField.Slot>
          </TextField.Root>

          {isOpen && (
            <div ref={dropdownRef} className="dropdown" onScroll={handleScroll}>
              {slidingWindow.items.length > 0 ? (
                slidingWindow.items.map((option, index) => (
                  <div
                    key={`${option.value}-${slidingWindow.startIndex + index}`}
                    className={`option ${index === focusedIndex ? 'focused' : ''}`}
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <Flex align="center" gap="3" p="3">
                      <Text weight="bold" size="2">
                        {option.value}
                      </Text>
                      {option.label && (
                        <Text size="1" color="gray">
                          {option.label}
                        </Text>
                      )}
                    </Flex>
                  </div>
                ))
              ) : (
                <Box p="4" style={{ textAlign: 'center' }}>
                  <Text size="2" color="gray">
                    {searchValue ? `No options found for "${searchValue}"` : 'No options available'}
                  </Text>
                </Box>
              )}

              {/* Add New Option */}
              {allowAddNew && searchValue.trim() && !exactMatch && (
                <div
                  className={`option ${slidingWindow.items.length === focusedIndex ? 'focused' : ''}`}
                  onClick={handleAddNew}
                  onMouseEnter={() => setFocusedIndex(slidingWindow.items.length)}
                  style={{ borderTop: '1px solid var(--gray-6)' }}
                >
                  <Flex align="center" gap="3" p="3">
                    <PlusIcon style={{ color: 'var(--blue-11)' }} />
                    <Text size="2" style={{ color: 'var(--blue-11)' }}>
                      Add "{searchValue}"
                    </Text>
                  </Flex>
                </div>
              )}

              {/* Window info */}
              {slidingWindow.totalItems > windowSize && (
                <Box
                  p="2"
                  style={{
                    textAlign: 'center',
                    borderTop: '1px solid var(--gray-6)',
                    background: 'var(--gray-2)',
                  }}
                >
                  <Text size="1" color="blue">
                    Showing {slidingWindow.startIndex + 1}-{slidingWindow.endIndex} of{' '}
                    {slidingWindow.totalItems} • Scroll for more
                  </Text>
                </Box>
              )}
            </div>
          )}
        </Box>
      </div>
    </Box>
  );
};
