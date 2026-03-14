import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ComponentType,
  createContext,
  type ElementType,
  forwardRef,
  useContext,
} from 'react';

import type { RecipeProps } from '../types/recipes.types';

/** Map of slot name → generated className string produced by a Panda `sva()` recipe. */
type SlotStyles = Record<string, string>;

/**
 * Minimal structural constraint that any Panda `sva()` recipe satisfies.
 * Intentionally uses `any` for the recipe's own argument types so TypeScript
 * resolves the constraint without fighting Panda's complex generated signatures —
 * while still preserving `R` as the concrete recipe type so that `RecipeProps<R>`
 * correctly extracts the specific variant union (e.g. `variant: 'line' | 'enclosed'`).
 */
type SlotRecipe = {
  (props?: Record<string, any>): SlotStyles;
  splitVariantProps(props: Record<string, any>): [Record<string, any>, Record<string, any>];
};

/**
 * Creates a React context-based style wiring system for Panda CSS slot recipes.
 *
 * Eliminates the need for consumers to call `recipe()` manually and thread
 * `className` props through every slot. Instead:
 * - The **provider** component (via `withProvider`) calls the recipe, splits variant
 *   props from component props, and injects the slot→className map into React context.
 * - Each **slot** component (via `withContext`) reads its className from context
 *   automatically — consumers pass zero styling props.
 *
 * ### Usage
 * ```ts
 * // component.tsx
 * const { withProvider, withContext } = createSlotRecipeContext(tabsRecipe);
 *
 * const TabsRoot    = withProvider(ArkTabs.Root,    'root');
 * const TabsList    = withContext(ArkTabs.List,      'list');
 * const TabsTrigger = withContext(ArkTabs.Trigger,   'trigger');
 * const TabsContent = withContext(ArkTabs.Content,   'content');
 *
 * export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };
 * ```
 *
 * ```tsx
 * // Consumer — no manual recipe call needed:
 * <Tabs.Root variant="line" size="md" defaultValue="overview">
 *   <Tabs.List>
 *     <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="overview">…</Tabs.Content>
 * </Tabs.Root>
 * ```
 */
export function createSlotRecipeContext<R extends SlotRecipe>(recipe: R) {
  type VariantProps = RecipeProps<R>;

  const StyleContext = createContext<SlotStyles | null>(null);

  /**
   * Wraps the **root** slot component.
   *
   * Accepts the recipe's variant props (e.g. `variant`, `size`) merged with the
   * underlying component's own props. Calls `recipe.splitVariantProps` to separate
   * them, computes the slot styles, and provides them to all descendant
   * `withContext` components via React context.
   *
   * @param Component - The root Ark UI (or any) component to wrap.
   * @param slot      - The slot key whose className is applied to this element (optional).
   */
  function withProvider<T extends ElementType>(Component: T, slot?: string) {
    type Props = VariantProps & ComponentPropsWithoutRef<T>;

    // Cast once here so JSX below stays clean; the public API is fully typed via Props.
    const Comp = Component as ComponentType<ComponentPropsWithoutRef<T>>;

    const StyledComponent = forwardRef<ComponentRef<T>, Props>(function StyledComponent(props, ref) {
      const [variantProps, restProps] = recipe.splitVariantProps(props);
      const styles = recipe(variantProps);

      return (
        <StyleContext.Provider value={styles}>
          <Comp
            ref={ref as never}
            className={slot ? styles[slot] : undefined}
            {...(restProps as ComponentPropsWithoutRef<T>)}
          />
        </StyleContext.Provider>
      );
    });

    StyledComponent.displayName = Comp.displayName ?? Comp.name ?? 'StyledComponent';

    return StyledComponent;
  }

  /**
   * Wraps a **slot** component.
   *
   * Reads the slot's className from the nearest `withProvider` ancestor's context
   * and applies it automatically. All original component props pass through unchanged.
   *
   * @param Component - The Ark UI (or any) slot component to wrap.
   * @param slot      - The slot key to read the className for.
   */
  function withContext<T extends ElementType>(Component: T, slot: string) {
    type Props = ComponentPropsWithoutRef<T>;

    const Comp = Component as ComponentType<ComponentPropsWithoutRef<T>>;

    const StyledComponent = forwardRef<ComponentRef<T>, Props>(function StyledComponent(props, ref) {
      const styles = useContext(StyleContext);
      return <Comp ref={ref as never} className={styles?.[slot] ?? ''} {...(props as ComponentPropsWithoutRef<T>)} />;
    });

    StyledComponent.displayName = Comp.displayName ?? Comp.name ?? 'StyledComponent';

    return StyledComponent;
  }

  return { withProvider, withContext };
}
