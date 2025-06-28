import React, { useEffect, useMemo, useRef, useState } from 'react';
import { matchSorter } from 'match-sorter';
import { Box, Card, Flex, Text, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { styles } from '../SearchableLanguageInput.styles';
import type { Country } from '../../LanguageSelector/languages/country.types';

interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

interface SearchableLanguageInputProps {
  countriesData: Country[];
  onLanguageSelect: (option: LanguageOption) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchableLanguageInput: React.FC<SearchableLanguageInputProps> = ({
  countriesData,
  onLanguageSelect,
  placeholder = 'Search languages, countries, or codes...',
  disabled = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [displayCount, setDisplayCount] = useState(25);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Flatten countries data into searchable language options
  const languageOptions = useMemo(() => {
    const options: LanguageOption[] = [];

    countriesData.forEach((country) => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([langCode, langName]) => {
          // Get native name for this language if available
          const nativeName = country.name.nativeName?.[langCode]?.common;

          options.push({
            languageCode: langCode,
            languageName: langName,
            countryName: country.name.common,
            countryCode: country.cca2,
            flagUrl: country.flags.png,
            nativeName,
            emoji: country.flag || '',
          });
        });
      }
    });

    // Sort alphabetically by language name for better UX
    return options.sort((a, b) => a.languageName.localeCompare(b.languageName));
  }, [countriesData]);

  // Use match-sorter for intelligent search
  const allFilteredOptions = useMemo(() => {
    if (!searchValue.trim()) {
      // When no search value, return all options (alphabetically sorted)
      return languageOptions;
    }

    return matchSorter(languageOptions, searchValue, {
      // keys: ['languageCode', 'languageName', 'countryName', 'countryCode', 'nativeName'], // NOTE: V1
      keys: ['languageCode', 'languageName', 'nativeName', 'countryCode', 'countryName'], // NOTE: V2
      threshold: matchSorter.rankings.CONTAINS,
    });
  }, [languageOptions, searchValue]);

  // Apply display limit for performance
  const filteredOptions = useMemo(() => {
    return allFilteredOptions.slice(0, displayCount);
  }, [allFilteredOptions, displayCount]);

  const handleSelectOption = (option: LanguageOption) => {
    onLanguageSelect(option);
    setSearchValue('');
    setIsOpen(false);
    setFocusedIndex(-1);
    setDisplayCount(25); // Reset display count
    inputRef.current?.blur();
  };

  // Handle clicking on the input field to open dropdown
  const handleInputClick = () => {
    setIsOpen(true);
    setDisplayCount(25); // Reset to initial count
    if (filteredOptions.length > 0) {
      setFocusedIndex(0);
    }
  };

  // Handle scroll to load more options
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (isNearBottom && displayCount < allFilteredOptions.length) {
      setDisplayCount((prev) => Math.min(prev + 25, allFilteredOptions.length));
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
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        e.preventDefault();
        break;
      case 'Enter':
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelectOption(filteredOptions[focusedIndex]);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        setDisplayCount(25); // Reset display count
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
        setDisplayCount(25); // Reset display count
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
          <TextField.Slot>
            <MagnifyingGlassIcon height="24" width="24" style={{ marginLeft: '6px' }} />
          </TextField.Slot>
          <TextField.Slot>
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={`${option.languageCode}-${option.countryCode}`}
                  className={`option ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <Flex align="center" gap="3" p="3">
                    <img
                      src={option.flagUrl}
                      alt={`${option.countryName} flag`}
                      width="24"
                      height="18"
                      style={{ borderRadius: '2px' }}
                    />
                    <Flex direction="column" style={{ flex: 1 }}>
                      <Flex align="center" gap="2">
                        <Text weight="bold" size="2">
                          {option.languageName}
                        </Text>
                        <Text size="1" color="gray">
                          ({option.languageCode})
                        </Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Text size="1" color="gray">
                          {option.countryName}
                        </Text>
                        {option.nativeName && option.nativeName !== option.languageName && (
                          <>
                            <Text size="1" color="gray">
                              •
                            </Text>
                            <Text size="1" color="gray">
                              {option.nativeName}
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Flex>
                    {option.emoji && <Text size="3">{option.emoji}</Text>}
                  </Flex>
                </div>
              ))
            ) : (
              <Box p="4" style={{ textAlign: 'center' }}>
                <Text size="2" color="gray">
                  {searchValue ? `No languages found for "${searchValue}"` : 'No languages available'}
                </Text>
              </Box>
            )}

            {/* Load More Indicator */}
            {filteredOptions.length < allFilteredOptions.length && (
              <Box p="3" style={{ textAlign: 'center', borderTop: '1px solid var(--gray-6)' }}>
                <Text size="1" color="gray">
                  Showing {filteredOptions.length} of {allFilteredOptions.length} • Scroll for more
                </Text>
              </Box>
            )}
          </Card>
        )}
      </Box>
    </div>
  );
};
