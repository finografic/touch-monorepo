/**
 * Tabs Component
 *
 * Styled wrapper around Ark UI Tabs using `createSlotRecipeContext`.
 * Ark handles all a11y: tablist/tab/tabpanel roles,
 * arrow-key navigation, aria-selected, aria-controls.
 *
 * Recipe variant props (`variant`, `size`) are accepted directly on `Tabs.Root` —
 * no manual recipe call or className threading needed.
 *
 * Usage:
 * ```tsx
 * import { Tabs } from '@workspace/design-system/components';
 *
 * <Tabs.Root defaultValue="overview" variant="line" size="md">
 *   <Tabs.List>
 *     <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *     <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
 *     <Tabs.Indicator />
 *   </Tabs.List>
 *   <Tabs.Content value="overview">…</Tabs.Content>
 *   <Tabs.Content value="settings">…</Tabs.Content>
 * </Tabs.Root>
 * ```
 */
import { Tabs as ArkTabs } from '@ark-ui/react';
import { createSlotRecipeContext } from 'internals/create-slot-recipe-context';

import { tabsRecipe } from './tabs.recipe';

const { withProvider, withContext } = createSlotRecipeContext(tabsRecipe);

export const Tabs = {
  Root: withProvider(ArkTabs.Root, 'root'),
  RootProvider: withProvider(ArkTabs.RootProvider, 'root'),
  List: withContext(ArkTabs.List, 'list'),
  Trigger: withContext(ArkTabs.Trigger, 'trigger'),
  Content: withContext(ArkTabs.Content, 'content'),
  Indicator: withContext(ArkTabs.Indicator, 'indicator'),
  // Render prop — provides machine context to children; no DOM output, no styling.
  Context: ArkTabs.Context,
};

export type { TabsFocusChangeDetails, TabsValueChangeDetails } from '@ark-ui/react';
