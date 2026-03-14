import type { RecipeProps } from 'types/recipes.types';
import type { textRecipe } from './text.recipe';

export type TextVariants = RecipeProps<typeof textRecipe>;

export type TextElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'figcaption';
