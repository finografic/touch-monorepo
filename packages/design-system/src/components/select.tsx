/**
 * Select Component
 *
 * Typed wrapper around Ark UI Select.
 * Ark handles all a11y: combobox/listbox roles, keyboard navigation,
 * aria-selected, aria-expanded, aria-controls.
 *
 * Styling comes from `selectRecipe` applied per slot via `className`.
 *
 * Usage:
 * ```tsx
 * import { Select } from '@workspace/design-system/components';
 * import { createListCollection } from '@ark-ui/react';
 * // cls from consuming app: selectRecipe({ size: 'md' })
 *
 * const frameworks = createListCollection({ items: ['React', 'Vue', 'Svelte'] });
 *
 * <Select.Root collection={frameworks} onValueChange={({ value }) => console.log(value)}>
 *   <Select.Label className={cls.label}>Framework</Select.Label>
 *   <Select.Control className={cls.control}>
 *     <Select.Trigger className={cls.trigger}>
 *       <Select.ValueText className={cls.valueText} placeholder="Pick one…" />
 *       <Select.Indicator className={cls.indicator}><ChevronDownIcon /></Select.Indicator>
 *     </Select.Trigger>
 *     <Select.ClearTrigger className={cls.clearTrigger}><XIcon /></Select.ClearTrigger>
 *   </Select.Control>
 *   <Select.Positioner className={cls.positioner}>
 *     <Select.Content className={cls.content}>
 *       <Select.List className={cls.list}>
 *         {frameworks.items.map(item => (
 *           <Select.Item key={item} item={item} className={cls.item}>
 *             <Select.ItemText className={cls.itemText}>{item}</Select.ItemText>
 *             <Select.ItemIndicator className={cls.itemIndicator}><CheckIcon /></Select.ItemIndicator>
 *           </Select.Item>
 *         ))}
 *       </Select.List>
 *     </Select.Content>
 *   </Select.Positioner>
 *   <Select.HiddenSelect />
 * </Select.Root>
 * ```
 */
import { Select as ArkSelect } from '@ark-ui/react';

// Re-export all Ark Select parts + helpers
export const Select = ArkSelect;
export { createListCollection, useListCollection } from '@ark-ui/react';
export type { SelectValueChangeDetails, CollectionItem, ListCollection } from '@ark-ui/react';
