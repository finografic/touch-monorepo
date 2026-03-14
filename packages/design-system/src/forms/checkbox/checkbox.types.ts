import type { RecipeProps } from 'types/recipes.types';

import type { checkboxRecipe } from './checkbox.recipe';

export type CheckboxVariants = RecipeProps<typeof checkboxRecipe>;
