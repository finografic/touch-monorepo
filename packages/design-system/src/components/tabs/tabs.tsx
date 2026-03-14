/**
 * Tabs Component
 *
 * Typed wrapper around Ark UI Tabs.
 * Ark handles all a11y: tablist/tab/tabpanel roles,
 * arrow-key navigation, aria-selected, aria-controls.
 *
 * Styling comes from `tabsRecipe` applied per slot via `className`.
 *
 * Usage:
 * ```tsx
 * import { Tabs } from '@workspace/design-system/components';
 * // cls from consuming app: tabsRecipe({ variant: 'line', size: 'md' })
 *
 * <Tabs.Root defaultValue="overview" className={cls.root}>
 *   <Tabs.List className={cls.list}>
 *     <Tabs.Trigger value="overview" className={cls.trigger}>Overview</Tabs.Trigger>
 *     <Tabs.Trigger value="settings" className={cls.trigger}>Settings</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="overview" className={cls.content}>…</Tabs.Content>
 *   <Tabs.Content value="settings" className={cls.content}>…</Tabs.Content>
 * </Tabs.Root>
 * ```
 */
import { Tabs as ArkTabs } from '@ark-ui/react';

// Re-export all Ark Tabs parts
export const Tabs = ArkTabs;
export type { TabsFocusChangeDetails, TabsValueChangeDetails } from '@ark-ui/react';
