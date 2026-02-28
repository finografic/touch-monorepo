import React, { useEffect, useMemo, useRef, useState } from 'react';

import { InputField } from '@workspace/design-system/forms';
import { AddNewButton } from 'forms/SelectSearchable/AddNewButton';
import { matchSorter } from 'match-sorter';

import { slugify } from 'utils/string.utils';
import type { SelectOption } from 'types/models/select-option.model';
import { DropdownPortal } from './DropdownPortal';
import { useColors } from 'styles';
import { CheckCircleIcon, ChevronDownIcon, Cross2Icon, MagnifyingGlassIcon, PlusIcon } from 'styles/icons';
import { styles, stylesDropdown } from './SelectSearchable.styles';

interface SearchableSelectProps {
  options: SelectOption[];
  onSelect: (value: string) => void;
  onClear?: () => void;
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
  onClear,
  onAddNew,
  placeholder = 'Type to search or add new...',
  disabled = false,
  windowSize = 20,
  allowAddNew = true,
  value = '',
}) => {
  const { colors } = useColors();
  const canAddNew = allowAddNew && typeof onAddNew === 'function';
  const [displayValue, setDisplayValue] = useState(value);
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [displayStart, setDisplayStart] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [isClearHovered, setIsClearHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the option that matches the current value to get its label
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  // Sync with external value changes - display label if available, otherwise value
  useEffect(() => {
    if (selectedOption?.label) {
      setDisplayValue(selectedOption.label);
    } else {
      setDisplayValue(value);
    }
  }, [value, selectedOption]);

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
  const shouldShowAddIcon = canAddNew && searchValue.trim().length > 3 && !exactMatch && !justAdded;
  const iconToShow = justAdded ? CheckCircleIcon : shouldShowAddIcon ? PlusIcon : MagnifyingGlassIcon;

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
    // Always pass the value to onSelect for form submission
    onSelect(option.value);
    // Display the label in the input (or value if no label)
    setDisplayValue(option.label || option.value);
    setSearchValue('');
    setIsOpen(false);
    setFocusedIndex(-1);
    setDisplayStart(0);
    setLastScrollTop(0);
    inputRef.current?.blur();
  };

  const handleAddNew = () => {
    if (!canAddNew) return;
    if (searchValue.trim() && onAddNew && !exactMatch) {
      const displayValue = searchValue.trim();
      const kebabValue = slugify(displayValue); // Convert to kebab-case for storage
      onAddNew(displayValue); // Pass the original display value, let the handler do the conversion
      onSelect(kebabValue); // But select the kebab-case value for the form
      setIsOpen(false);
      setFocusedIndex(-1);
      setDisplayStart(0);
      setLastScrollTop(0);

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      inputRef.current?.blur();
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchValue(''); // Clear search when opening
    setDisplayStart(0);
    setLastScrollTop(0);
    if (allFilteredOptions.length > 0) {
      setFocusedIndex(0);
    }
  };

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    setIsOpen(true);
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

  const handleBlur = () => {
    // If the input loses focus and the search value is empty, revert to label (or value if no label)
    if (searchValue === '') {
      if (selectedOption?.label) {
        setDisplayValue(selectedOption.label);
      } else {
        setDisplayValue(value);
      }
    }
  };

  // Add clear handler
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    if (onClear) {
      onClear();
      setDisplayValue('');
      setSearchValue('');
    }
  };

  const CLEAR_BUTTON_COLORS = {
    GREY: {
      background: '#F1F1F1',
      color: '#959595',
    },
    RED: {
      background: '#FEEBEC',
      color: '#D02D32',
    },
  };

  return (
    <div css={styles} className="searchable-select">
      <div ref={containerRef} className="search-container" style={{ position: 'relative' }}>
        {/* Clear button outside TextField */}
        {!isOpen && displayValue && onClear && (
          <div
            className="button-clear"
            onClick={handleClear}
            onMouseEnter={() => setIsClearHovered(true)}
            onMouseLeave={() => setIsClearHovered(false)}
            style={{
              position: 'absolute',
              right: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '3px',
              borderRadius: '4px',
              backgroundColor: isClearHovered
                ? CLEAR_BUTTON_COLORS.RED.background
                : CLEAR_BUTTON_COLORS.GREY.background,
              transition: 'all 0.2s ease',
            }}
          >
            <Cross2Icon
              height="18"
              width="18"
              className="clear-icon"
              style={{
                opacity: 1,
                color: isClearHovered ? CLEAR_BUTTON_COLORS.RED.color : CLEAR_BUTTON_COLORS.GREY.color,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
        )}

        <InputField.Root
          ref={inputRef}
          value={isOpen ? searchValue : displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputClick}
          onClick={handleInputClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        >
          <InputField.Slot side="left" className="input-slot-left action-icon-slot">
            {React.createElement(iconToShow, {
              height: 14,
              width: 14,
              style: {
                width: '22px',
                height: '22px',
                marginLeft: '4px',
                marginRight: '2px',
                marginBottom: '2px',
                cursor: shouldShowAddIcon ? 'pointer' : 'default',
                color: shouldShowAddIcon ? colors.infoLight : justAdded ? colors.successLight : 'inherit',
              },
              onClick: shouldShowAddIcon ? handleAddNew : undefined,
            })}
          </InputField.Slot>
          <InputField.Slot side="right" className="input-slot-right">
            <ChevronDownIcon
              height="18"
              width="18"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                marginLeft: '2px',
                marginRight: '4px',
              }}
            />
          </InputField.Slot>
        </InputField.Root>
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
                  {option.label && <span className="option-label">{option.label}</span>}
                  <span className="option-value">{option.value}</span>
                </div>
              </div>
            ))
          ) : options.length > 0 ? (
            /* No options message */
            <>
              <div
                className="option"
                style={{ textAlign: 'center', fontStyle: 'italic', pointerEvents: 'none' }}
              >
                <span className="option-label" style={{ color: colors.textXXLight75 }}>
                  {/* {options.length} */}
                  {searchValue ? `No options found for "${searchValue}"` : 'No options available'}
                </span>
              </div>
              {canAddNew && <AddNewButton handleAddNew={handleAddNew} searchValue={searchValue} />}
            </>
          ) : (
            canAddNew && <AddNewButton handleAddNew={handleAddNew} searchValue={searchValue} />
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
