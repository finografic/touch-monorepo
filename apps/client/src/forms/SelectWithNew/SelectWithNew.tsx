import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import type { DropdownChangeEvent, DropdownFilterOptions, DropdownProps } from 'primereact/dropdown';
import { Dropdown } from 'primereact/dropdown';

import type { SelectOption } from 'types/models/select-option.model';
import { styles } from './SelectWithNew.styles';

/**
 * Callback signature for onSelect - returns both value and label
 */
export interface SelectWithNewResult {
  value: string;
  label: string;
}

/**
 * SelectWithNewProps extends PrimeReact DropdownProps while maintaining
 * compatibility with the existing SelectCustom interface
 */
interface SelectWithNewProps
  extends Omit<DropdownProps, 'options' | 'value' | 'onChange' | 'optionLabel' | 'optionValue' | 'onSelect'> {
  /** Array of select options with value and label */
  options: SelectOption[];
  /** Current selected value (string) */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback when selection changes - receives both value and label */
  onSelect?: (result: SelectWithNewResult) => void;
  /** Allow empty/cleared selection */
  allowEmpty?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** HTML name attribute for form integration */
  name?: string;
  /** Alternative onChange handler for form libraries */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Text to show for "Add new" option (default: "Add new: {text}") */
  addNewText?: string | ((text: string) => string);
}

/**
 * SelectWithNew - PrimeReact-based dropdown component with "Add New" functionality
 *
 * Features:
 * - Editable dropdown with filter (type to search/select)
 * - Automatically detects when typed text doesn't match any option
 * - Shows "Add new: [text]" option when no match is found
 * - Adds new options dynamically to the internal options list
 * - onSelect callback returns both value and label: { value: string, label: string }
 * - Extends PrimeReact DropdownProps for full customization
 */
export const SelectWithNew = forwardRef<Dropdown, SelectWithNewProps>(
  (
    {
      options: originalOptions,
      value,
      className,
      defaultValue,
      onSelect,
      placeholder = '',
      allowEmpty = false,
      disabled = false,
      name,
      onChange,
      editable = true,
      showClear = allowEmpty,
      addNewText = (text: string) => `Add new: "${text}"`,
      filter = true, // Enable filter by default
      ...primeReactProps
    },
    ref,
  ) => {
    // Internal state: original options + newly added options
    const [internalOptions, setInternalOptions] = useState<SelectOption[]>(originalOptions);
    // Use ref for immediate filter access (no lag) + state for reactivity
    const filterValueRef = useRef<string>('');
    const [currentFilterText, setCurrentFilterText] = useState<string>('');

    // Update internal options when originalOptions prop changes
    useEffect(() => {
      setInternalOptions((prev) => {
        // Merge original options with any newly added ones
        const newOptionValues = new Set(originalOptions.map((opt) => opt.value));
        const addedOptions = prev.filter((opt) => !newOptionValues.has(opt.value));
        return [...originalOptions, ...addedOptions];
      });
    }, [originalOptions]);

    // Prepare dropdown options with empty option if needed
    const baseOptions = useMemo(() => {
      return allowEmpty
        ? [{ value: '', label: placeholder || '(None)' }, ...internalOptions]
        : internalOptions;
    }, [internalOptions, allowEmpty, placeholder]);

    // Track filter input - update both ref (immediate) and state (for reactivity)
    // Use a counter to force re-renders when filter changes
    const [filterUpdateCounter, setFilterUpdateCounter] = useState(0);
    const handleFilter = useCallback((e: { filter: string | null }) => {
      // Get filter text - don't trim immediately to preserve what user typed
      const filterText = e.filter || '';
      // Update ref immediately (no lag) - preserve original case and spacing
      filterValueRef.current = filterText;
      // Update state to trigger re-render and force useMemo recalculation
      setCurrentFilterText(filterText);
      setFilterUpdateCounter((prev) => prev + 1); // Force re-render
    }, []);

    // Enhanced options that include "Add new" when filter doesn't match
    // Read from ref for immediate access (no state lag)
    const enhancedOptions = useMemo(() => {
      // Always read from ref first for immediate access, fallback to state
      const filterTextRaw = filterValueRef.current || currentFilterText;
      const filterText = filterTextRaw.trim();

      if (!filterText) {
        return baseOptions;
      }

      const filterTextLower = filterText.toLowerCase();

      // Check if filter text exactly matches any option (case-insensitive, trimmed)
      const exactMatch = baseOptions.some(
        (option) =>
          option.label?.toLowerCase().trim() === filterTextLower ||
          option.value?.toLowerCase().trim() === filterTextLower,
      );

      // If no exact match, add "Add new" option
      // CRITICAL: Both value and label MUST start with exact filterText (case-sensitive, not trimmed)
      // so PrimeReact's filterBy="label,value" will match it when user types
      // We use filterTextRaw (not trimmed) to match exactly what user typed
      if (!exactMatch && filterText.length > 0) {
        const addNewLabel =
          typeof addNewText === 'function' ? addNewText(filterText) : `Add new: "${filterText}"`;
        const addNewOption: SelectOption = {
          // Value MUST start with exact filterText (preserve case) so PrimeReact's filter matches
          value: `${filterText}__add_new__`,
          // Label MUST start with exact filterText (preserve case) so PrimeReact's filter matches
          label: `${filterText} - ${addNewLabel}`,
        };
        return [addNewOption, ...baseOptions];
      }

      return baseOptions;
    }, [baseOptions, currentFilterText, addNewText, filterUpdateCounter]);

    // Handle PrimeReact's onChange event
    const handleChange = useCallback(
      (e: DropdownChangeEvent) => {
        const selectedValue = (e.value as string) ?? '';
        const selectedOption = enhancedOptions.find((opt) => opt.value === selectedValue);

        // Check if this is an "Add new" option (value format: "filterText__add_new__")
        if (selectedValue.includes('__add_new__')) {
          // Extract the text that was typed (it's at the start before __add_new__)
          const newText = selectedValue.split('__add_new__')[0].trim();

          if (newText) {
            // Generate a unique value for the new option (you can customize this logic)
            // For now, use the text as-is for the label, and create a slug for the value
            const newValue = newText.toLowerCase().replace(/\s+/g, '-');
            const newOption: SelectOption = {
              value: newValue,
              label: newText, // Keep original case for label
            };

            // Add to internal options
            setInternalOptions((prev) => {
              // Check if it already exists (shouldn't happen, but safety check)
              if (
                prev.some(
                  (opt) => opt.value === newValue || opt.label.toLowerCase() === newText.toLowerCase(),
                )
              ) {
                return prev;
              }
              return [...prev, newOption];
            });

            // Call onSelect with the new option
            if (onSelect) {
              onSelect({ value: newValue, label: newText });
            } else if (onChange) {
              const event = {
                target: { name, value: newValue },
              } as React.ChangeEvent<HTMLSelectElement>;
              onChange(event);
            }

            // Clear filter
            filterValueRef.current = '';
            setCurrentFilterText('');
            return;
          }
        }

        // Normal selection - existing option
        if (selectedOption) {
          try {
            if (onSelect) {
              onSelect({
                value: selectedOption.value,
                label: selectedOption.label || selectedOption.value,
              });
            } else if (onChange) {
              const event = {
                target: { name, value: selectedOption.value },
              } as React.ChangeEvent<HTMLSelectElement>;
              onChange(event);
            }
          } catch (error) {
            console.error('SelectWithNew handleChange error:', error);
          }
        }
      },
      [enhancedOptions, onSelect, onChange, name],
    );

    // Determine current value - handle empty string for allowEmpty
    const currentValue = useMemo(() => {
      if (value !== undefined) {
        return value === '' ? null : value;
      }
      if (defaultValue !== undefined) {
        return defaultValue === '' ? null : defaultValue;
      }
      return null;
    }, [value, defaultValue]);

    return (
      <div css={styles} className={clsx('select-with-new', className)}>
        <Dropdown
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          onFilter={handleFilter}
          options={enhancedOptions}
          optionLabel="label"
          optionValue="value"
          placeholder={placeholder}
          disabled={disabled}
          editable={editable}
          showClear={showClear}
          filter={filter}
          filterBy="label,value"
          className={clsx('select-with-new-dropdown', className)}
          {...primeReactProps}
        />
      </div>
    );
  },
);

SelectWithNew.displayName = 'SelectWithNew';
