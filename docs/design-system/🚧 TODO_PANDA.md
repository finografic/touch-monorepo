The client needs to do two things: import your design system's preset into its own `panda.config.ts`, and run its own codegen to generate a local `styled-system/` with the full runtime utilities typed against your tokens.

**Client's `panda.config.ts`:**

```ts
import { defineConfig } from '@pandacss/dev';
import { pandaPreset } from '@workspace/design-system/panda.preset';

export default defineConfig({
  // Your design system preset — brings in all tokens, recipes, patterns
  presets: ['@pandacss/preset-base', pandaPreset],

  // Scan both local app code AND the design system's components
  include: [
    './src/**/*.{ts,tsx}',
    './node_modules/@workspace/design-system/src/**/*.{ts,tsx}',
  ],

  // Where Panda generates the typed runtime utilities
  outdir: 'styled-system',

  // Your app's JSX framework
  jsxFramework: 'react',
});
```

A few things to note on the `include` array: the second entry pointing into the design system's `src/` is needed so Panda can extract the styles used in your design system's component files (the `.tsx` files in `components/`, `forms/`, etc.). Without it, Panda won't generate CSS for those components. With pnpm workspaces, `@workspace/design-system` resolves to the local package, so the path works.

**Then run codegen in the client:**

```bash
cd apps/client
pnpm panda codegen
```

This generates the client's `styled-system/` folder with everything — `css/`, `recipes/`, `tokens/`, `types/`, `patterns/`, `jsx/`. All typed against your design system's token definitions.

**Client usage after that:**

```tsx
// Import generated utilities — typed against your DS tokens
import { css } from '../styled-system/css';
import { button } from '../styled-system/recipes';

// Recipes — fully typed, autocomplete shows your variants
<button className={button({ size: 'md', variant: 'solid', colorScheme: 'primary' })}>
  Click
</button>

// Ad-hoc styles — token keys are type-checked
<div className={css({ p: '4', bg: 'primary.500', borderRadius: 'md' })}>
  Content
</div>
```

**Client's build script** should run codegen before compilation:

```json
{
  "scripts": {
    "dev": "panda codegen --watch & vite",
    "build": "panda codegen && vite build"
  }
}
```

The `--watch` flag in dev mode re-runs codegen when your tokens or recipes change, keeping the `styled-system/` types in sync as you develop.

**One thing to check:** your client probably already has a `panda.config.ts` and `styled-system/` from before. The key change is adding your design system preset to the `presets` array and including the design system's source in the `include` glob. The client's existing local styles (`css()` calls, local `cva()` recipes) continue working — the preset just extends what's available.
