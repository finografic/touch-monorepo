import { createListCollection, Select as ArkSelect } from '@ark-ui/react';
import { useMemo } from 'react';

import { icons } from '../../icons';
import type { SelectOption } from '../select-option';

const { ChevronDownIcon, CheckIcon } = icons;

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowEmpty?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function Select({
  options,
  value,
  onSelect,
  placeholder = 'Select…',
  disabled = false,
  allowEmpty = false,
  className,
  id,
}: SelectProps) {
  const items = useMemo(() => {
    const base = options.map((o) => ({ ...o, label: o.label ?? o.value }));
    if (allowEmpty) return [{ value: '', label: placeholder, disabled: false }, ...base];
    return base;
  }, [options, allowEmpty, placeholder]);

  const collection = useMemo(
    () =>
      createListCollection({
        items,
        itemToValue: (o) => o.value,
        itemToString: (o) => o.label ?? o.value,
      }),
    [items],
  );

  return (
    <ArkSelect.Root
      collection={collection}
      value={value !== undefined && value !== '' ? [value] : []}
      onValueChange={({ value }) => onSelect?.(value[0] ?? '')}
      disabled={disabled}
      className={['ds-select', className].filter(Boolean).join(' ')}
      id={id}
      positioning={{ sameWidth: true, placement: 'bottom-start' }}
    >
      <ArkSelect.Control className="ds-select__control">
        <ArkSelect.Trigger className="ds-select__trigger">
          <ArkSelect.ValueText placeholder={placeholder} className="ds-select__value" />
          <ArkSelect.Indicator className="ds-select__indicator">
            <ChevronDownIcon width={16} height={16} />
          </ArkSelect.Indicator>
        </ArkSelect.Trigger>
      </ArkSelect.Control>

      <ArkSelect.Positioner className="ds-select__positioner">
        <ArkSelect.Content className="ds-select__content">
          <ArkSelect.List className="ds-select__list">
            {items.map((item) => (
              <ArkSelect.Item key={item.value} item={item} className="ds-select__item">
                <ArkSelect.ItemText className="ds-select__item-text">{item.label}</ArkSelect.ItemText>
                <ArkSelect.ItemIndicator className="ds-select__item-indicator">
                  <CheckIcon width={14} height={14} />
                </ArkSelect.ItemIndicator>
              </ArkSelect.Item>
            ))}
          </ArkSelect.List>
        </ArkSelect.Content>
      </ArkSelect.Positioner>

      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  );
}

Select.displayName = 'Select';
