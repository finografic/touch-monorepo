// export { Checkbox } from './Checkbox';
export type { FieldBoxProps } from './FieldBox';
export { FieldBox } from './FieldBox';
export type { InputFieldRootProps, InputFieldSlotProps } from './InputField';
export { InputField, InputFieldRoot, InputFieldSlot } from './InputField';
export type { RadioGroupRootPropsDS } from './RadioGroup';
export { RadioGroup } from './RadioGroup';
export type { SelectOption } from './Select/select.types';
export type { SelectProps } from './Select/SelectDefault';
// export { Select } from './Select/SelectDefault';
export type { SelectSearchableProps } from './Select/SelectSearchable';
export { SelectSearchable } from './Select/SelectSearchable';
export type { SliderRootPropsDS } from './Slider';
export { Slider } from './Slider';

// ======================================================================== //
// NEW: MOVED FROM components TO forms

// ── Styled wrappers (recipe-ready) ───────────────────────────────────────────
export type { CheckboxFieldClassNames, CheckboxFieldProps } from './checkbox';
export { CheckboxField } from './checkbox';
export type { SwitchFieldProps, SwitchProps } from './switch';
export { SwitchField } from './switch';

// ── Ark UI primitives (re-exported for consistent imports) ───────────────────
// Use these when you need full composition control.
// Apply recipe classNames per slot: e.g. checkboxRecipe({ size: 'md' })
export { Checkbox } from './checkbox';
export type { CollectionItem, ListCollection, SelectValueChangeDetails } from './select';
export { Select } from './select';
export { createListCollection, useListCollection } from './select';
export { Switch } from './switch';

// ======================================================================== //
// NEW: MOVED FROM recipes TO forms
export { checkboxRecipe } from './checkbox.recipe';
export { formFieldRecipe } from './form-field.recipe';
export { inputRecipe } from './input.recipe';
export { labelRecipe } from './label.recipe';
export { selectRecipe } from './select.recipe';
export { switchRecipe } from './switch.recipe';
