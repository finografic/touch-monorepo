import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Box, Card, Flex, Text, TextField } from '@radix-ui/themes';
import { matchSorter } from 'match-sorter';

import { styles } from './SearchableLanguageInput.styles';

interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

interface SearchableLanguageInputCuratedProps {
  languageOptions: LanguageOption[];
  onLanguageSelect: (option: LanguageOption) => void;
  placeholder?: string;
  disabled?: boolean;
  windowSize?: number; // Size of the sliding window
}

export const SearchableLanguageInputCurated: React.FC<SearchableLanguageInputCuratedProps> = ({
  languageOptions,
  onLanguageSelect,
  placeholder = 'Search curated languages...',
  disabled = false,
  windowSize = 40,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [displayStart, setDisplayStart] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use match-sorter for intelligent search
  const allFilteredOptions = useMemo(() => {
    if (!searchValue.trim()) {
      // When no search value, return all options (already sorted by priority)
      return languageOptions;
    }

    return matchSorter(languageOptions, searchValue, {
      keys: ['languageCode', 'languageName', 'nativeName', 'countryCode', 'countryName'],
      threshold: matchSorter.rankings.CONTAINS,
    });
  }, [languageOptions, searchValue]);

  // Simple sliding window - just slice the array
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

  const handleSelectOption = (option: LanguageOption) => {
    onLanguageSelect(option);
    setSearchValue('');
    setIsOpen(false);
    setFocusedIndex(-1);
    setDisplayStart(0); // Reset to beginning
    setLastScrollTop(0); // Reset scroll tracking
    inputRef.current?.blur();
  };

  // Handle clicking on the input field to open dropdown
  const handleInputClick = () => {
    setIsOpen(true);
    setDisplayStart(0); // Reset to beginning
    setLastScrollTop(0); // Reset scroll tracking
    if (slidingWindow.items.length > 0) {
      setFocusedIndex(0);
    }
  };

  // Bidirectional scroll handler - slide window in both directions
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const isNearTop = scrollTop <= 10;

    // Determine scroll direction
    const isScrollingDown = scrollTop > lastScrollTop;
    const isScrollingUp = scrollTop < lastScrollTop;

    // Update last scroll position
    setLastScrollTop(scrollTop);

    // Slide window forward when scrolling down and near bottom
    if (isScrollingDown && isNearBottom && slidingWindow.endIndex < allFilteredOptions.length) {
      setDisplayStart((prev) => Math.min(prev + 10, Math.max(0, allFilteredOptions.length - windowSize)));
    }

    // Slide window backward when scrolling up and near top
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

    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev < slidingWindow.items.length - 1 ? prev + 1 : prev));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        e.preventDefault();
        break;
      case 'Enter':
        if (focusedIndex >= 0 && slidingWindow.items[focusedIndex]) {
          handleSelectOption(slidingWindow.items[focusedIndex]);
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
    <div css={styles} className="searchable-language-input">
      <Box className="search-container" style={{ position: 'relative' }}>
        <TextField.Root
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleInputClick}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          size="3"
        >
          <TextField.Slot side="left" className="input-slot-left search-icon-slot">
            <MagnifyingGlassIcon height="24" width="24" style={{ marginLeft: '6px' }} />
          </TextField.Slot>
          <TextField.Slot side="right" className="input-slot-right dropdown-chevron-slot">
            <ChevronDownIcon
              height="24"
              width="24"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                marginRight: '8px',
              }}
            />
          </TextField.Slot>
        </TextField.Root>

        {isOpen && (
          <Card
            ref={dropdownRef}
            className="dropdown"
            onScroll={handleScroll}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 9999,
              marginTop: '4px',
              maxHeight: '300px',
              overflowY: 'auto',
              background: 'var(--color-background)',
              border: '1px solid #a3a3a3',
            }}
          >
            {slidingWindow.items.length > 0 ? (
              slidingWindow.items.map((option, index) => (
                <div
                  key={`${option.languageCode}-${option.countryCode}-${slidingWindow.startIndex + index}`}
                  className={`option ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <Flex align="center" gap="3" p="3">
                    <img
                      src={option.flagUrl}
                      alt={`${option.countryName} flag`}
                      style={{
                        width: '24px',
                        height: '18px',
                        objectFit: 'cover',
                        borderRadius: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Flex align="center" gap="2">
                        <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
                          {option.languageName}
                        </Text>
                        <Text size="2" style={{ color: 'var(--gray-9)' }}>
                          ({option.languageCode})
                        </Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>
                          {option.countryName}
                        </Text>
                        {option.nativeName && option.nativeName !== option.languageName && (
                          <>
                            <Text size="2" style={{ color: 'var(--gray-8)' }}>
                              •
                            </Text>
                            <Text size="2" style={{ color: 'var(--gray-10)' }}>
                              {option.nativeName}
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </div>
              ))
            ) : (
              <Box p="4">
                <Text size="2" style={{ color: 'var(--gray-9)' }}>
                  No languages found matching "{searchValue}"
                </Text>
              </Box>
            )}

            {/* Sliding window info for debugging */}
            {slidingWindow.totalItems > windowSize && (
              <Box p="2" style={{ borderTop: '1px solid var(--gray-6)', background: 'var(--gray-2)' }}>
                <Text size="1" style={{ color: 'var(--gray-9)' }}>
                  Showing {slidingWindow.startIndex + 1}-{slidingWindow.endIndex} of{' '}
                  {slidingWindow.totalItems} languages
                </Text>
              </Box>
            )}
          </Card>
        )}
      </Box>
    </div>
  );
};
