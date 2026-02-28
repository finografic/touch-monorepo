/**
 * forms/primitives — raw Ark UI re-exports, no DS styling applied.
 *
 * Use when you need full composition control and will apply your own styles.
 * For pre-styled DS components, import from '@workspace/design-system/forms'.
 *
 * Import path must end in /primitives — this is intentional and enforces
 * a deliberate choice to bypass DS styling.
 *
 * @example
 * import { Checkbox } from '@workspace/design-system/forms';            // DS styled
 * import { Checkbox } from '@workspace/design-system/forms/primitives'; // raw Ark
 */

export { Checkbox, Field, RadioGroup } from '@ark-ui/react';
