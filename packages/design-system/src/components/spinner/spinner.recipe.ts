/**
 * Spinner Recipe
 *
 * Base: continuous spin animation via the `spin` Panda keyframe.
 */
import { cva } from '@styled-system/css';

export const spinnerRecipe = cva({
  base: {
    animation: 'spin 1s linear infinite',
    flexShrink: 0,
  },
});
