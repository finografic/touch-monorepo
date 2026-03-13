import {
  type ComponentType,
  createContext,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  useContext,
} from 'react';

import type { RecipeProps } from '../types/recipes.types';

type StyleMap = Record<string, string>;

type SlotRecipe<T extends (...args: never[]) => unknown> = {
  (props?: RecipeProps<T>): StyleMap;
  splitVariantProps(props: Record<string, unknown>): [RecipeProps<T>, Record<string, unknown>];
};

export function createStyleContext<R extends (...args: never[]) => unknown>(recipe: SlotRecipe<R>) {
  const StyleContext = createContext<StyleMap | null>(null);

  function withProvider<ComponentProps extends object>(
    Component: ComponentType<ComponentProps>,
    slot?: string,
  ) {
    const StyledComponent = forwardRef(function StyledComponent(
      props: unknown,
      ref: ForwardedRef<unknown>,
    ): ReactElement {
      const [variantProps, restProps] = recipe.splitVariantProps(props as Record<string, unknown>);
      const styles = recipe(variantProps);

      return (
        <StyleContext.Provider value={styles}>
          <Component
            ref={ref}
            className={slot ? styles?.[slot] : undefined}
            {...(restProps as ComponentProps)}
          />
        </StyleContext.Provider>
      );
    });

    StyledComponent.displayName =
      typeof Component === 'string'
        ? Component
        : ((Component as ComponentType).displayName ??
          (Component as ComponentType).name ??
          'StyledComponent');

    return StyledComponent;
  }

  function withContext<ComponentProps extends object>(
    Component: ComponentType<ComponentProps>,
    slot?: string,
  ) {
    if (!slot) {
      return Component;
    }

    const StyledComponent = forwardRef(function StyledComponent(
      props: unknown,
      ref: ForwardedRef<unknown>,
    ): ReactElement {
      const styles = useContext(StyleContext);

      return <Component ref={ref} className={styles?.[slot] ?? ''} {...(props as ComponentProps)} />;
    });

    StyledComponent.displayName =
      typeof Component === 'string'
        ? Component
        : ((Component as ComponentType).displayName ??
          (Component as ComponentType).name ??
          'StyledComponent');

    return StyledComponent;
  }

  return {
    withProvider,
    withContext,
  };
}
