import { useMemo, useState } from 'react';
import { Combobox as ArkCombobox, createListCollection } from '@ark-ui/react';
import { matchSorter } from 'match-sorter';

import { icons } from '../../icons';
import type { SelectOption } from '../select-option';

const { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon, PlusIcon, XIcon } = icons;

export interface SelectSearchableProps {
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  onClear?: () => void;
  /** Called with the typed string when user wants to add a new item. */
  onAddNew?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Soft cap on visible items before the list scrolls. Default 20. */
  windowSize?: number;
  className?: string;
}

export function SelectSearchable({
  options,
  value = '',
  onSelect,
  onClear,
  onAddNew,
  placeholder = 'Type to search…',
  disabled = false,
  windowSize = 20,
  className,
}: SelectSearchableProps) {
  const [inputValue, setInputValue] = useState('');
  const canAddNew = typeof onAddNew === 'function';

  // Resolve the display label for the current value
  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  // Filter options with match-sorter
  const filtered = useMemo(() => {
    if (!inputValue.trim()) return options.slice(0, windowSize);
    return matchSorter(options, inputValue, {
      keys: ['value', 'label', 'description', 'category'],
      threshold: matchSorter.rankings.CONTAINS,
    }).slice(0, windowSize);
  }, [options, inputValue, windowSize]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: filtered,
        itemToValue: (o) => o.value,
        itemToString: (o) => o.label ?? o.value,
      }),
    [filtered],
  );

  const exactMatch = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    return options.some((o) => o.value.toLowerCase() === q || (o.label ?? '').toLowerCase() === q);
  }, [options, inputValue]);

  const showAddNew = canAddNew && inputValue.trim().length > 0 && !exactMatch;

  const handleSelect = ({ value }: { value: string[] }) => {
    onSelect(value[0] ?? '');
    setInputValue('');
  };

  const handleAddNew = () => {
    if (showAddNew) {
      onAddNew!(inputValue.trim());
      setInputValue('');
    }
  };

  // Determine left-slot icon
  const LeadIcon = showAddNew ? PlusIcon : MagnifyingGlassIcon;

  return (
    <ArkCombobox.Root
      collection={collection}
      value={value ? [value] : []}
      inputValue={inputValue}
      onInputValueChange={({ inputValue }) => setInputValue(inputValue)}
      onValueChange={handleSelect}
      onOpenChange={() => setInputValue('')}
      disabled={disabled}
      openOnClick
      className={['ds-searchable-select', className].filter(Boolean).join(' ')}
      positioning={{ sameWidth: true, placement: 'bottom-start' }}
    >
      <ArkCombobox.Control className="ds-searchable-select__control">
        {/* Left icon */}
        <span className="ds-searchable-select__lead-icon" aria-hidden>
          <LeadIcon
            width={16}
            height={16}
            onClick={showAddNew ? handleAddNew : undefined}
            style={showAddNew ? { cursor: 'pointer' } : undefined}
          />
        </span>

        <ArkCombobox.Input
          className="ds-searchable-select__input"
          placeholder={selectedOption ? (selectedOption.label ?? selectedOption.value) : placeholder}
        />

        {/* Clear button */}
        {value && onClear && (
          <button
            type="button"
            className="ds-searchable-select__clear"
            onClick={(e) => { e.stopPropagation(); onClear(); setInputValue(''); }}
            aria-label="Clear"
            tabIndex={-1}
          >
            <XIcon width={14} height={14} />
          </button>
        )}

        {/* Chevron toggle */}
        <ArkCombobox.Trigger className="ds-searchable-select__trigger" aria-label="Toggle">
          <ChevronDownIcon width={16} height={16} className="ds-searchable-select__chevron" />
        </ArkCombobox.Trigger>
      </ArkCombobox.Control>

      <ArkCombobox.Positioner className="ds-searchable-select__positioner">
        <ArkCombobox.Content className="ds-searchable-select__content">
          <ArkCombobox.List className="ds-searchable-select__list">
            {filtered.length === 0 && !showAddNew && (
              <div className="ds-searchable-select__empty">No options found</div>
            )}

            {filtered.map((item) => (
              <ArkCombobox.Item key={item.value} item={item} className="ds-searchable-select__item">
                <ArkCombobox.ItemText className="ds-searchable-select__item-text">
                  {item.label && item.label !== item.value ? (
                    <>
                      <span className="ds-searchable-select__item-label">{item.label}</span>
                      <span className="ds-searchable-select__item-value">{item.value}</span>
                    </>
                  ) : (
                    item.value
                  )}
                </ArkCombobox.ItemText>
                <ArkCombobox.ItemIndicator className="ds-searchable-select__item-indicator">
                  <CheckIcon width={14} height={14} />
                </ArkCombobox.ItemIndicator>
              </ArkCombobox.Item>
            ))}

            {/* Add New row */}
            {showAddNew && (
              <button
                type="button"
                className="ds-searchable-select__add-new"
                onClick={handleAddNew}
              >
                <PlusIcon width={14} height={14} />
                Add &ldquo;{inputValue.trim()}&rdquo;
              </button>
            )}
          </ArkCombobox.List>
        </ArkCombobox.Content>
      </ArkCombobox.Positioner>
    </ArkCombobox.Root>
  );
}

SelectSearchable.displayName = 'SelectSearchable';
