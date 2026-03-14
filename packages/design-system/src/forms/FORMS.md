# Forms

All form components live in `src/forms/`, one folder per component.
Consumers will always use these with `react-hook-form`.

## Folder convention

Each folder contains exactly four files:

```
{name}/
  {name}.recipe.ts   ← Panda CSS recipe (cva or sva)
  {name}.types.ts    ← Exported variant/prop types
  {name}.tsx         ← React component
  index.ts           ← Barrel (re-exports all three)
```

## Component inventory

| Component           | Recipe type    | Ark UI          | createStyleContext | Notes                                                   |
| ------------------- | -------------- | --------------- | ------------------ | ------------------------------------------------------- |
| `checkbox`          | `sva`          | `Checkbox`      | yes                | `withProvider` + `withContext`; `CheckboxField` wrapper |
| `field-box`         | `sva`          | `Field.Root`    | —                  | RHF-aware layout wrapper; auto-wires error/warning      |
| `input-field`       | `sva`          | `Field.Input`   | —                  | `InputField.Root` + `InputField.Slot` compound          |
| `input-number`      | `sva`          | `NumberInput`   | —                  | Ark NumberInput; prefix/suffix slots; `Intl` formatting |
| `label`             | `cva`          | —               | —                  | Plain `<label>` wrapper; size variant                   |
| `radio-group`       | `sva`          | `RadioGroup`    | yes                | `withProvider` + `withContext`; `default` + `card` variant |
| `select`            | `sva`          | `Select`        | yes                | `withProvider` + `withContext`; bare compound           |
| `select-default`    | *(selectRecipe)* | `Select`      | —                  | `options[]` convenience wrapper; reuses `selectRecipe`  |
| `select-searchable` | `sva`          | `Combobox`      | —                  | `match-sorter` filtering; `onAddNew` callback           |
| `slider`            | `sva`          | `Slider`        | yes                | `withProvider` + `withContext`                          |
| `switch`            | `cva`          | `Switch`        | —                  | Bare `Switch = ArkSwitch` re-export + `SwitchField` wrapper |

## RHF compatibility

All components accept:

```ts
value, onChange, onBlur, name, ref, error?: FieldError | string
```

Use `FieldBox` to wrap any control with RHF-aware label/hint/error layout:

```tsx
<FieldBox name="email" label="Email" hint="We'll never share this">
  <InputField.Root {...field} />
</FieldBox>
```

`FieldBox` auto-wires to `useFormContext()` when inside a `<FormProvider>` — error
shows only after submit, warning debounced on touch.

## Patterns

### `sva` + `createStyleContext` — Ark UI compound components

Same pattern as `src/components/`. `createStyleContext` connects the slot recipe to
each Ark sub-component.

```tsx
const { withProvider, withContext } = createStyleContext(selectRecipe);
export const Select = {
  Root: withProvider(ArkSelect.Root, 'root'),
  Trigger: withContext(ArkSelect.Trigger, 'trigger'),
  // ...
};
```

### Convenience wrappers — `*Field` / `SelectDefault`

Pre-composed components that accept a flat props API. Intended for the common case;
use the bare compound (e.g. `Select.*`) when you need full layout control.

```tsx
// Convenience
<SwitchField name="active" label="Active" checked={value} onCheckedChange={onChange} />

// Bare compound
<Switch.Root ...>
  <Switch.Control className={switchRecipe({ size })}>
    <Switch.Thumb className="switch-thumb" />
  </Switch.Control>
</Switch.Root>
```

### `select-default` — no own recipe

`SelectDefault` is a convenience wrapper that applies `selectRecipe` directly (no
separate recipe file). It builds an Ark `createListCollection` from a plain
`options: SelectOption[]` prop.

```tsx
<SelectDefault options={opts} value={val} onSelect={(v) => setValue(v)} />
```

### `select-searchable` — Ark Combobox

Uses `ArkCombobox` (not `ArkSelect`) to support keyboard filtering via `match-sorter`.

```tsx
<SelectSearchable options={opts} value={val} onSelect={onChange} onAddNew={(v) => create(v)} />
```

## Adding a new form component

1. Create `src/forms/{name}/` with the four files above.
2. Export from `src/forms/index.ts`.
3. If it has a recipe, re-export from `src/recipes/index.ts`.
4. Update this file.
