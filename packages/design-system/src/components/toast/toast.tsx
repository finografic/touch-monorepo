/**
 * Toast Component
 *
 * Styled wrapper around Ark UI Toast using `createStyleContext`.
 * Ark handles placement, stacking, auto-dismiss timers, and a11y (role="status").
 *
 * Setup (once in app root):
 * ```tsx
 * import { createToaster, Toaster } from '@workspace/design-system/components';
 *
 * export const toaster = createToaster({ placement: 'top-end', gap: 8 });
 *
 * // In your root component:
 * <Toaster toaster={toaster} />
 * ```
 *
 * Fire a toast anywhere:
 * ```tsx
 * toaster.create({ title: 'Saved', description: 'Settings saved.', type: 'success' });
 * ```
 *
 * Custom render with styled Toast parts:
 * ```tsx
 * <Toaster
 *   toaster={toaster}
 *   render={(toast) => (
 *     <Toast.Root key={toast.id} status={toast.type}>
 *       <Toast.Title>{toast.title}</Toast.Title>
 *       {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
 *       <Toast.CloseTrigger asChild>
 *         <button aria-label="Dismiss"><XIcon /></button>
 *       </Toast.CloseTrigger>
 *     </Toast.Root>
 *   )}
 * />
 * ```
 */
import { createToaster, Toast as ArkToast, Toaster } from '@ark-ui/react';
import { createStyleContext } from '@styled-system/jsx';

import { toastRecipe } from './toast.recipe';

const { withProvider, withContext } = createStyleContext(toastRecipe);

export { createToaster, Toaster };

export const Toast = {
  Root: withProvider(ArkToast.Root, 'root'),
  Title: withContext(ArkToast.Title, 'title'),
  Description: withContext(ArkToast.Description, 'description'),
  CloseTrigger: withContext(ArkToast.CloseTrigger, 'closeTrigger'),
  ActionTrigger: withContext(ArkToast.ActionTrigger, 'actionTrigger'),
  Context: ArkToast.Context, // render prop
};
