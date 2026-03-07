/**
 * scripts/generate.ts
 *
 * Reads src/icons.json and writes:
 *   src/icons.ts   — ICONS map, wrapped exports, public API
 *   src/index.ts   — named exports + re-exports
 *
 * Run via: pnpm icons.generate
 * Also called in-process by the Hono server after every POST to /api/icons-json.
 *
 * !! Does NOT touch src/icons.utils.ts — that file is handwritten and permanent.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Paths ──────────────────────────────────────────────────────────────────────

const root      = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const jsonPath  = path.join(root, 'src', 'icons.json');
const tsPath    = path.join(root, 'src', 'icons.ts');
const indexPath = path.join(root, 'src', 'index.ts');

// ── Types ──────────────────────────────────────────────────────────────────────

interface IconEntry {
  lucideName:  string;  // kebab-case Lucide name, e.g. "arrow-up"
  exportName:  string;  // PascalCase without "Icon" suffix, e.g. "ArrowUp"
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** "arrow-up" → "ArrowUp" — maps lucideName to the Lucide React export */
function toLucideExport(lucideName: string): string {
  return lucideName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// ── Generate ───────────────────────────────────────────────────────────────────

/**
 * Reads icons.json and writes icons.ts + index.ts.
 * Exported so the Hono server can call it directly on each POST
 * (avoids ESM module-cache issues with top-level side effects).
 */
export function generate(): void {
  const entries: IconEntry[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Stable alphabetical order by exportName — diffs are always readable
  entries.sort((a, b) => a.exportName.localeCompare(b.exportName));

  // ── Build icons.ts ───────────────────────────────────────────────────────────

  const maxKeyLen = Math.max(...entries.map(e => `${e.exportName}Icon`.length));

  const registryLines = entries
    .map(({ lucideName, exportName }) => {
      const key    = `${exportName}Icon`;
      const value  = `Lucide.${toLucideExport(lucideName)}`;
      const pad    = ' '.repeat(maxKeyLen - key.length + 2);
      return `  ${key}:${pad}${value},`;
    })
    .join('\n');

  const iconsTsContent = `\
/**
 * Icon Registry — @workspace/icons
 *
 * !! GENERATED FILE — do not edit by hand.
 * !! Edit src/icons.json via the picker UI, then run: pnpm icons.generate
 *
 * Source of truth: packages/icons/src/icons.json
 */

import * as Lucide from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ── Icon registry ──────────────────────────────────────────────────────────────

const ICONS = {
${registryLines}
} as const;

// ── Auto-wrap ──────────────────────────────────────────────────────────────────

type WrappedIconMap = { [K in keyof typeof ICONS]: ReturnType<typeof createIconWrapper> };

const wrappedIcons = Object.fromEntries(
  Object.entries(ICONS).map(([name, icon]) => [name, createIconWrapper(icon, name)]),
) as WrappedIconMap;

// ── Public API ─────────────────────────────────────────────────────────────────

/** All registered icons as a strongly-typed object. Destructure at the call site. */
export const icons = wrappedIcons;

/** Union of all registered icon export names. */
export type IconName = keyof typeof ICONS;

/** Sorted list of all registered icon names (useful for pickers / docs). */
export const ICON_NAMES = (Object.keys(ICONS) as IconName[]).sort();

/** Type of any wrapped icon component returned by \`createIconWrapper\`. */
export type IconComponent = ReturnType<typeof createIconWrapper>;
`;

  // ── Build index.ts ───────────────────────────────────────────────────────────

  const namedExports = entries
    .map(({ exportName }) => `  ${exportName}Icon,`)
    .join('\n');

  const indexTsContent = `\
/**
 * src/index.ts — @workspace/icons
 *
 * !! GENERATED FILE — do not edit by hand.
 * !! Edit src/icons.json via the picker UI, then run: pnpm icons.generate
 */

export type { IconComponent, IconName } from './icons';
export { ICON_NAMES, icons } from './icons';

// Named icon exports
export const {
${namedExports}
} = icons;

// Expose wrapper factory for consumers who need to register app-specific icons
export type { IconProps } from './icons.utils';
export { createIconWrapper } from './icons.utils';
`;

  // ── Write ─────────────────────────────────────────────────────────────────────

  fs.writeFileSync(tsPath,    iconsTsContent,  'utf8');
  fs.writeFileSync(indexPath, indexTsContent,  'utf8');

  console.log(`✓ icons.ts   — ${entries.length} icons`);
  console.log(`✓ index.ts   — ${entries.length} named exports`);
}

// ── CLI entry point ────────────────────────────────────────────────────────────
// Called directly via: pnpm icons.generate (tsx scripts/generate.ts)

generate();
