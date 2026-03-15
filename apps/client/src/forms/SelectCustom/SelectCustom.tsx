import React, { forwardRef, useCallback, useRef, useState } from 'react';

import { InputField } from '@finografic/design-system/forms';
import clsx from 'clsx';
import { DropdownPortal } from 'forms/SelectSearchable/DropdownPortal';

import type { SelectOption } from 'types/models/select-option.model';
import { ChevronDownIcon } from '@finografic/icons';
import { styles, stylesDropdown } from './SelectCustom.styles';

interface SelectCustomProps {
  id?: string;
  options: SelectOption[];
  value?: string;
  className?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
  allowEmpty?: boolean;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectCustom = forwardRef<HTMLInputElement, SelectCustomProps>(
  (
    {
      id,
      options,
      value,
      className,
      defaultValue,
      onSelect,
      placeholder = '',
      allowEmpty = false,
      disabled = false,
      name,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get display value - prioritize label over value
    const displayValue = value !== undefined ? value : defaultValue || '';
    const selectedOption = options.find((option) => option.value === displayValue);
    // If no option is selected and displayValue is empty, show placeholder (empty string)
    const displayText = selectedOption ? selectedOption.label || selectedOption.value : '';

    const handleValueChange = useCallback(
      (newValue: string) => {
        try {
          // Use onSelect as primary handler, fallback to onChange if needed
          if (onSelect) {
            onSelect(newValue);
          } else if (onChange) {
            const event = {
              target: { name, value: newValue },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(event);
          }
        } catch (error) {
          console.error('SelectCustom handleValueChange error:', error);
        }
      },
      [onSelect, onChange, name],
    );

    const handleSelectOption = (option: SelectOption) => {
      handleValueChange(option.value);
      setIsOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.blur();
    };

    const handleInputClick = () => {
      if (!disabled) {
        setIsOpen(true);
        setFocusedIndex(-1);
      }
    };

    const handleCloseDropdown = () => {
      setIsOpen(false);
      setFocusedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          setIsOpen(true);
          setFocusedIndex(allowEmpty ? -1 : 0);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          if (allowEmpty && focusedIndex === -1) {
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          }
          e.preventDefault();
          break;
        case 'ArrowUp':
          if (allowEmpty && focusedIndex === 0) {
            setFocusedIndex(-1);
          } else {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          }
          e.preventDefault();
          break;
        case 'Enter':
          if (focusedIndex === -1 && allowEmpty) {
            handleSelectOption({ value: '', label: placeholder });
          } else if (focusedIndex >= 0 && focusedIndex < options.length) {
            handleSelectOption(options[focusedIndex]);
          }
          e.preventDefault();
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    return (
      <div css={styles} className={clsx('searchable-select', className, isOpen && 'open')}>
        <div ref={containerRef} className="search-container" style={{ position: 'relative' }}>
          <InputField.Root
            id={id}
            ref={inputRef}
            value={displayText}
            readOnly
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          >
            <InputField.Slot
              side="right"
              className={clsx('input-slot-right', isOpen && 'open')}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
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
          <div>
            {allowEmpty && (
              <div
                key="empty-option"
                className={`option empty-option ${focusedIndex === -1 ? 'focused' : ''}`}
                onClick={() => handleSelectOption({ value: '', label: placeholder })}
                onMouseEnter={() => setFocusedIndex(-1)}
                // style={{ fontStyle: 'italic', opacity: 0.7 }}
              >
                <div className="option-content">
                  <span className="option-value">{placeholder || '(None)'}</span>
                </div>
              </div>
            )}
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={option.value}
                  className={`option ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="option-content">
                    <span className="option-value">{option.label || option.value}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="option" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                <span className="option-label">No options available</span>
              </div>
            )}
          </div>
        </DropdownPortal>
      </div>
    );
  },
);

SelectCustom.displayName = 'SelectCustom';
