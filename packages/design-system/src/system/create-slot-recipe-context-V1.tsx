import { type ComponentType, createContext, type ForwardedRef, forwardRef, useContext } from 'react';

type RecipeVariantProps = Record<string, unknown>;

type SlotRecipe = {
  (props?: RecipeVariantProps): Record<string, string>;
  splitVariantProps(props: RecipeVariantProps): [RecipeVariantProps, Record<string, unknown>];
};

type StyleMap = Record<string, string>;

export function createStyleContext<R extends SlotRecipe>(recipe: R) {
  const StyleContext = createContext<StyleMap | null>(null);

  function withProvider<T extends object>(Component: ComponentType<T>, slot?: string) {
    const StyledComponent = forwardRef(function StyledComponent(props: any, ref: ForwardedRef<unknown>) {
      const [variantProps, restProps] = recipe.splitVariantProps(props);
      const styles = recipe(variantProps);

      return (
        <StyleContext.Provider value={styles}>
          <Component ref={ref as never} className={styles?.[slot ?? '']} {...(restProps as T)} />
        </StyleContext.Provider>
      );
    });

    StyledComponent.displayName = Component.displayName ?? Component.name ?? 'StyledComponent';

    return StyledComponent;
  }

  function withContext<T extends object>(Component: ComponentType<T>, slot?: string) {
    if (!slot) return Component;

    const StyledComponent = forwardRef(function StyledComponent(props: any, ref: ForwardedRef<unknown>) {
      const styles = useContext(StyleContext);

      return <Component ref={ref as never} className={styles?.[slot] ?? ''} {...props} />;
    });

    StyledComponent.displayName = Component.displayName ?? Component.name ?? 'StyledComponent';

    return StyledComponent;
  }

  return {
    withProvider,
    withContext,
  };
}
