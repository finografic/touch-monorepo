import {
  type ComponentType,
  createContext,
  type ElementType,
  type ForwardedRef,
  forwardRef,
  useContext,
} from 'react';

import type { RecipeProps } from '../types/recipes.types';

type StyleMap = Record<string, string>;

type SlotRecipe<T extends (...args: any) => any> = {
  (props?: RecipeProps<T>): StyleMap;
  splitVariantProps(props: Record<string, unknown>): [RecipeProps<T>, Record<string, unknown>];
};

export function createStyleContext<R extends (...args: any) => any>(recipe: SlotRecipe<R>) {
  const StyleContext = createContext<StyleMap | null>(null);

  function withProvider<T extends ElementType>(Component: T, slot?: string) {
    const StyledComponent = forwardRef(function StyledComponent(props: any, ref: ForwardedRef<any>) {
      const [variantProps, restProps] = recipe.splitVariantProps(props);
      const styles = recipe(variantProps);

      const Comp = Component as any;

      return (
        <StyleContext.Provider value={styles}>
          <Comp ref={ref} className={slot ? styles?.[slot] : undefined} {...restProps} />
        </StyleContext.Provider>
      );
    });

    StyledComponent.displayName =
      typeof Component === 'string'
        ? Component
        : (Component as ComponentType).displayName || (Component as ComponentType).name || 'StyledComponent';

    return StyledComponent;
  }

  function withContext<T extends ElementType>(Component: T, slot?: string) {
    if (!slot) return Component;

    const StyledComponent = forwardRef(function StyledComponent(props: any, ref: ForwardedRef<any>) {
      const styles = useContext(StyleContext);
      const Comp = Component as any;

      return <Comp ref={ref} className={styles?.[slot] ?? ''} {...props} />;
    });

    StyledComponent.displayName =
      typeof Component === 'string'
        ? Component
        : (Component as ComponentType).displayName || (Component as ComponentType).name || 'StyledComponent';

    return StyledComponent;
  }

  return {
    withProvider,
    withContext,
  };
}
