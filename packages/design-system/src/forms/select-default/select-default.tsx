import { CheckIcon, ChevronDownIcon } from '@workspace/icons';

import { createListCollection, Select as ArkSelect } from '@ark-ui/react';
import { forwardRef, useMemo } from 'react';

import { selectRecipe } from '../select/select.recipe';
import type { SelectDefaultProps } from './select-default.types';

/**
 * SelectDefault — pre-composed Select with a simple `options[]` API.
 *
 * Accepts a flat array of `SelectOption` objects instead of requiring a
 * Panda collection. Uses the full `selectRecipe` for styling.
 *
 * For full composition control use `Select.*` parts directly.
 */
export const SelectDefault = forwardRef<HTMLButtonElement, SelectDefaultProps>(
  (
    {
      options,
      value,
      onSelect,
      onChange,
      onBlur,
      name,
      placeholder = 'Select…',
      disabled = false,
      allowEmpty = false,
      size = 'md',
      id,
      className,
    },
    ref,
  ) => {
    const cls = selectRecipe({ size });

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

    const handleValueChange = ({ value: vals }: { value: string[] }) => {
      const next = vals[0] ?? '';
      onSelect?.(next);
      onChange?.(next);
    };

    return (
      <ArkSelect.Root
        id={id}
        name={name}
        collection={collection}
        value={value !== undefined && value !== '' ? [value] : []}
        onValueChange={handleValueChange}
        onOpenChange={() => onBlur?.()}
        disabled={disabled}
        className={[cls.root, className].filter(Boolean).join(' ')}
        positioning={{ sameWidth: true, placement: 'bottom-start' }}
      >
        <ArkSelect.Control className={cls.control}>
          <ArkSelect.Trigger ref={ref} className={cls.trigger}>
            <ArkSelect.ValueText placeholder={placeholder} className={cls.valueText} />
            <ArkSelect.Indicator className={cls.indicator}>
              <ChevronDownIcon className="icon icon-sm" aria-hidden />
            </ArkSelect.Indicator>
          </ArkSelect.Trigger>
        </ArkSelect.Control>

        <ArkSelect.Positioner className={cls.positioner}>
          <ArkSelect.Content className={cls.content}>
            <ArkSelect.List className={cls.list}>
              {items.map((item) => (
                <ArkSelect.Item key={item.value} item={item} className={cls.item}>
                  <ArkSelect.ItemText className={cls.itemText}>{item.label}</ArkSelect.ItemText>
                  <ArkSelect.ItemIndicator className={cls.itemIndicator}>
                    <CheckIcon className="icon icon-sm" aria-hidden />
                  </ArkSelect.ItemIndicator>
                </ArkSelect.Item>
              ))}
            </ArkSelect.List>
          </ArkSelect.Content>
        </ArkSelect.Positioner>

        <ArkSelect.HiddenSelect />
      </ArkSelect.Root>
    );
  },
);

SelectDefault.displayName = 'SelectDefault';
