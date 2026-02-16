/**
 * Checkbox Component
 *
 * Ark UI Checkbox primitive — accessible checkbox with indeterminate state.
 *
 * Usage:
 * ```tsx
 * import { Checkbox } from '@workspace/design-system/components';
 *
 * <Checkbox.Root
 *   checked={isChecked}
 *   onCheckedChange={({ checked }) => setIsChecked(checked)}
 * >
 *   <Checkbox.Control>
 *     <Checkbox.Indicator>✓</Checkbox.Indicator>
 *   </Checkbox.Control>
 *   <Checkbox.Label>Accept terms</Checkbox.Label>
 *   <Checkbox.HiddenInput />
 * </Checkbox.Root>
 * ```
 */
import { Checkbox as ArkCheckbox } from '@ark-ui/react';

export const Checkbox = ArkCheckbox;
