/**
* FILE SEMANTICS & ORGANIZATION GUIDE
*
* This document clarifies the purpose and organization of files in the styles system.
* Each file type has a specific role in the color system architecture.
 */

/**
* 🎨 COLORS.* FILES
* Purpose: Core color definitions, types, and main exports
*
* * colors.styles.ts: Main export point for the colors object
* * colors.types.ts: TypeScript type definitions for colors
* * custom/custom.colors.ts: Base color mapping (COLOR_MAPPING)
* * custom/cssvar.palette.ts: CSS variable palette generator
 */

/**
* 🎯 PALETTE.* FILES
* Purpose: Palette generation logic, constants, and utilities
*
* * palette.constants.ts: Core palette constants (BASE_COLORS, SHADE_PREFIX)
* * palette.types.ts: TypeScript types for palette generation
* * utils/generateMyPalette.util.ts: Auto-generates MY_PALETTE.ts
* * utils/generateClassColorVariants.ts: Generates CSS class variants
 */

/**
* 🌙 THEME.* FILES
* Purpose: Theme-specific color values (light/dark mode)
*
* * themes/light.colors.ts: Light theme hex values (AUTO-GENERATED)
* * themes/dark.colors.ts: Dark theme hex values (AUTO-GENERATED)
* * themes/index.ts: Theme exports
* * theme.ts: Theme switching logic
 */

/**
* 🔧 CONSTANTS.* FILES
* Purpose: Organized constants for different contexts
*
* * css.constants.ts: CSS-specific constants (lowercase, CSS variables)
* * js.constants.ts: JS-specific constants (PascalCase, JS objects)
* * palette.constants.ts: Core palette constants
* * global.constants.ts: Global layout and spacing constants
 */

/**
* 🛠️ UTILS.* FILES
* Purpose: Utility functions and generators
*
* * utils/css-color-variables.utils.ts: CSS variable generation
* * utils/generateMyPalette.util.ts: MY_PALETTE.ts generator
* * utils/generateClassColorVariants.ts: CSS class variant generator
* * utils/camelToKebab.ts: String conversion utility
 */

/**
* 📚 DOCS.* FILES
* Purpose: Documentation and visual references
*
* * docs/COLOR_SYSTEM.md: Complete system documentation
* * docs/MY_PALETTE.ts: Visual color reference (AUTO-GENERATED)
* * docs/MY_PALETTE-ORIG.ts: Original reference (backup)
 */

/**
* 🎨 STYLES.* FILES
* Purpose: Actual CSS-in-JS styles and components
*
* * global.styles.ts: Global CSS and theme variables
* * fonts.styles.ts: Typography styles
* * forms.styles.ts: Form component styles
* * custom/buttons.styles.ts: Button component styles
* * custom/content-*.styles.ts: Content-specific styles
 */

/**
* 🏗️ ARCHITECTURE PRINCIPLES
*
* 1. SINGLE SOURCE OF TRUTH: All colors derive from COLOR_MAPPING
* 2. AUTO-GENERATION: Theme files and references are generated
* 3. SEPARATION OF CONCERNS: Constants, types, and styles are separate
* 4. CONSISTENT NAMING: File extensions indicate purpose (.constants, .types, .styles)
* 5. CSS VARIABLES: All colors use CSS variables for theming
 */

/**
* 🔄 GENERATION FLOW
*
* 1. COLOR_MAPPING (custom/custom.colors.ts) → Base color definitions
* 2. CSS Variables (utils/css-color-variables.utils.ts) → CSS variable generation
* 3. Theme Files (themes/*.colors.ts) → Theme-specific hex values
* 4. MY_PALETTE.ts (docs/MY_PALETTE.ts) → Visual reference
* 5. Colors Object (colors.styles.ts) → Main export for components
 */
