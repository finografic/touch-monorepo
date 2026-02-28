import React, { useEffect, useMemo, useRef, useState } from 'react';

import { InputField } from '@workspace/design-system/forms';
import { card } from 'styled-system/recipes';
import { matchSorter } from 'match-sorter';

import type { Country } from '../../components/LanguageSelector/languages/country.types';
import { ChevronDownIcon, MagnifyingGlassIcon } from 'styles/icons';
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

interface SearchableLanguageInputSlidingProps {
  countriesData: Country[];
  onLanguageSelect: (option: LanguageOption) => void;
  placeholder?: string;
  disabled?: boolean;
  windowSize?: number; // Size of the sliding window
}

export const SearchableLanguageInput: React.FC<SearchableLanguageInputSlidingProps> = ({
  countriesData,
  onLanguageSelect,
  placeholder = 'Search languages, countries, or codes... (Sliding Window)',
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

  // TODO: SLIDING WINDOW SCROLL ISSUE
  // Current Issue: Upward scrolling still has buggy behavior where users get "stuck"
  // at window boundaries and need to scroll back-and-forth to make progress upward.
  //
  // Problem Analysis:
  // 1. When sliding window moves backward (up), the scroll container's content shrinks
  // 2. This causes the scroll position to "reset" and user loses momentum
  // 3. User must scroll down slightly to build up scroll distance before triggering upward slide again
  // 4. Creates frustrating back-and-forth motion to reach earlier items
  //
  // Potential Solutions to Explore:
  // 1. Implement proper virtual scrolling with fixed container height (like original attempt)
  // 2. Use scroll velocity/momentum detection instead of position-based triggers
  // 3. Implement smooth scrolling with programmatic scroll position management
  // 4. Consider pagination-style approach with prev/next buttons
  // 5. Use intersection observer API to detect when to slide window
  //
  // Current State: Basic bidirectional sliding that works but has UX issues going upward
  // This version is stable and doesn't crash, good baseline for future improvements

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
      <div className="search-container" style={{ position: 'relative' }}>
        <InputField.Root
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleInputClick}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        >
          <InputField.Slot side="left" className="input-slot-left search-icon-slot">
            <MagnifyingGlassIcon height="24" width="24" style={{ marginLeft: '6px' }} />
          </InputField.Slot>
          <InputField.Slot side="right" className="input-slot-right dropdown-chevron-slot">
            <ChevronDownIcon
              height="24"
              width="24"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                marginRight: '8px',
              }}
            />
          </InputField.Slot>
        </InputField.Root>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`${card()} dropdown`}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem' }}>
                    <img
                      src={option.flagUrl}
                      alt={`${option.countryName} flag`}
                      width="24"
                      height="18"
                      style={{ borderRadius: '2px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{option.languageName}</span>
                        <span>({option.languageCode})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{option.countryName}</span>
                        {option.nativeName && option.nativeName !== option.languageName && (
                          <>
                            <span>•</span>
                            <span>{option.nativeName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {option.emoji && <span>{option.emoji}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <span>{searchValue ? `No languages found for "${searchValue}"` : 'No languages available'}</span>
              </div>
            )}

            {/* Simple Debug Info */}
            {slidingWindow.totalItems > windowSize && (
              <div
                style={{
                  padding: '0.5rem',
                  textAlign: 'center',
                  borderTop: '1px solid var(--gray-6)',
                  background: 'var(--gray-2)',
                }}
              >
                <span>
                  🎭 Simple Window: Showing {slidingWindow.startIndex + 1}-{slidingWindow.endIndex} of{' '}
                  {slidingWindow.totalItems} • Window Size: {windowSize} • Scroll for more
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
