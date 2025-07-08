import React, { useEffect, useMemo, useRef, useState } from 'react';
import { matchSorter } from 'match-sorter';
import { TextField } from '@radix-ui/themes';
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { styles, stylesDropdown } from './SelectSearchable.styles';
import { DropdownPortal } from './DropdownPortal';
import type { SelectOption } from 'types/models/select-option.model';

interface SearchableSelectProps {
  options: SelectOption[];
  onSelect: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  windowSize?: number;
  allowAddNew?: boolean;
  value?: string;
}

export const SelectSearchable: React.FC<SearchableSelectProps> = ({
  options,
  onSelect,
  onAddNew,
  placeholder = 'Type to search or add new...',
  disabled = false,
  windowSize = 20,
  allowAddNew = true,
  value = '',
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [displayStart, setDisplayStart] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Changed from dropdownRef to containerRef

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

  // Determine which icon to show
  const shouldShowAddIcon = allowAddNew && searchValue.trim().length > 3 && !exactMatch && !justAdded;
  const iconToShow = justAdded ? CheckIcon : shouldShowAddIcon ? PlusIcon : MagnifyingGlassIcon;

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

      // Show check icon briefly
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);

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

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setDisplayStart(0);
    setLastScrollTop(0);
  };

  return (
    <div css={styles} className="searchable-select">
      <div ref={containerRef} className="search-container" style={{ position: 'relative' }}>
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
            {React.createElement(iconToShow, {
              height: 16,
              width: 16,
              style: {
                marginLeft: '6px',
                cursor: shouldShowAddIcon ? 'pointer' : 'default',
                color: shouldShowAddIcon ? 'var(--blue-11)' : justAdded ? 'var(--green-11)' : 'inherit',
              },
              onClick: shouldShowAddIcon ? handleAddNew : undefined,
            })}
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
      </div>

      <DropdownPortal
        triggerRef={containerRef}
        isOpen={isOpen}
        onClose={handleCloseDropdown}
        className="dropdown"
        css={stylesDropdown}
      >
        <div onScroll={handleScroll}>
          {slidingWindow.items.length > 0 ? (
            slidingWindow.items.map((option, index) => (
              <div
                key={`${option.value}-${slidingWindow.startIndex + index}`}
                className={`option ${index === focusedIndex ? 'focused' : ''}`}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="option-content">
                  <span className="option-value">{option.value}</span>
                  {option.label && <span className="option-label">{option.label}</span>}
                </div>
              </div>
            ))
          ) : (
            /* No options message */
            <div className="option" style={{ textAlign: 'center', fontStyle: 'italic' }}>
              <span className="option-label">
                {searchValue ? `No options found for "${searchValue}"` : 'No options available'}
              </span>
            </div>
          )}

          {/* Add New Option */}
          {allowAddNew && searchValue.trim() && !exactMatch && (
            <div
              className={`option ${slidingWindow.items.length === focusedIndex ? 'focused' : ''}`}
              onClick={handleAddNew}
              onMouseEnter={() => setFocusedIndex(slidingWindow.items.length)}
              style={{ borderTop: '1px solid var(--gray-6)' }}
            >
              <div className="option-content">
                <PlusIcon style={{ color: 'var(--blue-11)', width: '14px', height: '14px' }} />
                <span className="option-value" style={{ color: 'var(--blue-11)' }}>
                  Add "{searchValue}"
                </span>
              </div>
            </div>
          )}

          {/* Window info */}
          {slidingWindow.totalItems > windowSize && (
            <div className="window-info">
              Showing {slidingWindow.startIndex + 1}-{slidingWindow.endIndex} of {slidingWindow.totalItems} •
              Scroll for more
            </div>
          )}
        </div>
      </DropdownPortal>
    </div>
  );
};
