# design-system - palette

çLet me look at the current file structure to plan the split properly.Good. The natural groupings I see are: types (shared across everything), oklch utilities (parse/format), shade logic (lightness ramp, chroma, hue — they're coupled), generators (the public API), and the base color config. Let me split it.Now let me verify the structure and clean up the old monolith:Here's how it landed:

```
palette/
├── index.ts           — barrel exports (public API surface)
├── palette.types.ts   — OklchColor, ShadeStop, ShadePalette, PandaToken, SemanticBase
├── oklch.utils.ts     — parseOklch, formatOklch, clamp
├── shades.ts          — buildLightnessRamp, chromaMultiplier, hueShift + their config constants
├── generators.ts      — generatePalette, generateAllPalettes (public API)
└── bases.ts           — SEMANTIC_BASES + migration cheatsheet
```

The grouping logic: `shades.ts` keeps all the ramp computation together with its configuration constants (`DARK_FLOOR`, `CHROMA_TAPERS`, `DARK_FACTORS`, etc.) since those constants only make sense in context of the functions they parameterize. I also pulled the inline magic numbers from `buildLightnessRamp` into named constants (`LIGHT_BLEND_RATIOS`, `DARK_FACTORS`) — easier to tune when you're eyeballing generated palettes.

I also extracted `PandaToken` and `SemanticBase` as proper types in `palette.types.ts` so `generators.ts` and `bases.ts` don't repeat the `{ value: string }` shape inline.

---

Great questions. Let me think through these systematically.

## On the shade count question

**Go 11 to match Panda/TW.** Here's why: you're building a design-system _package_ now, not just internal styles. The moment you or anyone else reaches for a Panda utility like `bg: 'primary.200'` and it doesn't exist because you only have 9 stops, you'll hit friction constantly. The whole point of adopting the ecosystem is to stop fighting convention.

Your current 7-step scale maps cleanly onto the middle of the 11-step range:

| Your Key  | → Panda Shade |
| --------- | ------------- |
| `xxlight` | `100`         |
| `xlight`  | `200`         |
| `light`   | `300`         |
| **base**  | **`500`**     |
| `dark`    | `700`         |
| `xdark`   | `800`         |
| `xxdark`  | `900`         |

That leaves `50`, `400`, `600`, and `950` as the new additions. `50` and `950` are the near-white/near-black endpoints you already want. `400` and `600` fill the gaps flanking your base — `400` is the "lighter-than-base-but-not-a-tint" step (great for hover states on light backgrounds), and `600` is the "slightly darker base" (great for hover on solid buttons). You'll use both constantly.

**I wouldn't fight the 50–950 numeric naming.** I know it's not semantic, but here's the thing: your _semantic layer_ is already handled by the `colorPalette` virtual color system in Park UI (`colorPalette.solid.bg`, `colorPalette.subtle.bg`, etc.). The shade numbers are the _raw token layer_ — they're the implementation detail that your semantic tokens reference. Nobody writes `bg: 'primary.300'` in component code; they write `bg: 'colorPalette.subtle.bg'` and the semantic token resolves to the appropriate shade. So the numbers stay hidden behind the abstraction.

## On the OKLCH palette generator

OKLCH is perfect for this because you can generate perceptually uniform shade ramps by interpolating lightness while keeping chroma and hue consistent (with minor hue adjustments at the extremes to avoid washed-out tints). Here's how I'd approach it:To summarize the reasoning:

**Go 11 shades, adopt 50–950.** Your semantic names map cleanly onto the numeric scale — you're not losing anything, you're gaining four useful intermediate stops. The mapping at the bottom of the generator file shows exactly how your old names land:

| Old Name   | → Shade | What's New                                |
| ---------- | ------- | ----------------------------------------- |
| `xxxlight` | `50`    | Near-white endpoint you wanted            |
| `xxlight`  | `100`   |                                           |
| `xlight`   | `200`   |                                           |
| `lighter`  | `300`   |                                           |
| `light`    | `400`   | **New:** hover-on-light-bg, "almost base" |
| `base`     | `500`   | Your anchor                               |
| `dark`     | `600`   | **New:** hover-on-solid-bg, active states |
| `darker`   | `700`   |                                           |
| `xdark`    | `800`   |                                           |
| `xxdark`   | `900`   |                                           |
| `xxxdark`  | `950`   | Near-black endpoint you wanted            |

The `400` and `600` stops are the ones you'll thank yourself for later — Park UI's recipes use them heavily for hover/active states on buttons and surfaces, and without them you'd be hacking around with opacity or custom overrides.

**On the 50–950 naming:** your semantic layer is the `colorPalette.solid.bg` / `colorPalette.subtle.bg` system from Park UI. The shade numbers are plumbing. You'll rarely type `primary.300` in component code — the recipes abstract it away.

The generator itself uses three OKLCH tricks: non-linear lightness interpolation (perceptually even steps), chroma tapering at extremes (prevents neon tints and muddy darks), and a subtle ±3° hue shift (warm tints, cool shades — natural pigment behavior). It's a starting point — you'll want to eyeball the output and tune the lightness ramp and chroma curves to taste, especially for `warning` since its base lightness is already quite high (~0.77).
