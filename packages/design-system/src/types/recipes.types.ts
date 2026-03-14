import type { RecipeVariantProps } from '../../styled-system/css';

export type RecipeProps<T extends (...args: any) => any> = NonNullable<RecipeVariantProps<T>>;
