# Design System Usage Rules

This project uses a custom design system (`@workspace/design-system`) built on
**Ark UI** and **Panda CSS**. Follow these rules when consuming it.

## Panda MCP server

A Panda CSS MCP server is configured in `packages/design-system/` (`.mcp.json` for
Claude Code, `.cursor/mcp.json` for Cursor). Use it to query live token values,
recipe slots, and config instead of guessing from static docs. Run it with:

```bash
pnpm panda:mcp   # from packages/design-system/
```

## Source protection

- Do **not** modify any file under `packages/design-system/src/` unless the user
  explicitly asks for a DS change.
- Do **not** install competing styling libraries (Tailwind, Emotion, styled-components,
  Radix Themes, etc.). Panda CSS is the style engine.

## Import paths

```ts
import { Button, Badge, Dialog, ... }  from '@workspace/design-system/components';
import { Select, SelectDefault, SelectSearchable, InputField, InputNumber,
         Checkbox, CheckboxField, RadioGroup, Slider, Switch, SwitchField,
         FieldBox, Label }             from '@workspace/design-system/forms';
import { buttonRecipe, selectRecipe, ... } from '@workspace/design-system/recipes';
import { colors }                      from '@workspace/design-system/tokens';
import { Row, Col, Container }         from '@workspace/design-system/grid';
```

Raw Ark UI primitives are importable directly from `@ark-ui/react` — there is no
`forms/primitives` escape hatch.

## Panda CSS gotchas

- **Never** use `<Box css={...}>` or `<Flex css={...}>` — causes TS2590. Use
  `<div css={...}>` or `<span css={...}>` instead.
- Spacing props must be **numeric**: `gap={4}` not `gap="4"` (ESLint enforced).
- `Row` justify uses full CSS values: `"space-between"` not `"between"`.

## Tokens

- Colors follow an 11-stop shade scale: `xxxlight → xxxdark`. No alpha variants.
- Use semantic tokens in recipes (`bg.panel`, `fg.muted`, `border.subtle`).
- Use the `colors` map for inline style migration (`colors.primaryLight` →
  `var(--colors-primary-light)`).

## Form components

All form components accept RHF-compatible props: `value`, `onChange`, `onBlur`,
`name`, `ref`, `error?: FieldError | string`.

Use `FieldBox` to add label/hint/error layout around any control:

```tsx
<FieldBox name="email" label="Email" hint="We'll never share this">
  <InputField.Root {...field} />
</FieldBox>;
```

`FieldBox` auto-wires to `useFormContext()` when inside a `<FormProvider>`.

Use `SelectDefault` for simple option lists; use `Select.*` compound when you need
full layout control.

## Recipe application

- `cva` recipes: call the function and pass the result as `className`.
- `sva` + `createStyleContext`: use the compound sub-components directly — they
  receive slot classes automatically.
- Do not call `sva` recipe functions directly in consuming app code.
