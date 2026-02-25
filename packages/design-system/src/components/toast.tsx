/**
 * Toast Component
 *
 * Typed wrapper around Ark UI Toast.
 * Ark handles: placement, stacking, auto-dismiss timers, aria roles.
 *
 * Styling comes from `toastRecipe` applied per slot.
 *
 * Setup (once in app root):
 * ```tsx
 * import { createToaster, Toaster } from '@workspace/design-system/components';
 *
 * export const toaster = createToaster({
 *   placement: 'top-end',
 *   gap: 8,
 * });
 *
 * // In your root component:
 * <Toaster toaster={toaster} />
 * ```
 *
 * Fire a toast anywhere:
 * ```tsx
 * import { toaster } from './toaster'; // your singleton
 *
 * toaster.create({
 *   title: 'Saved',
 *   description: 'Settings saved successfully.',
 *   type: 'success',       // 'info' | 'success' | 'warning' | 'error'
 *   duration: 4000,        // ms, default 5000
 * });
 * ```
 *
 * Custom Toaster with recipe styles:
 * ```tsx
 * import { Toast, Toaster, createToaster } from '@workspace/design-system/components';
 * // cls from consuming app's generated: toastRecipe({ status: 'success' })
 *
 * <Toaster
 *   toaster={toaster}
 *   render={(toast) => (
 *     <Toast.Root key={toast.id} className={cls.root}>
 *       <Toast.Title className={cls.title}>{toast.title}</Toast.Title>
 *       {toast.description && (
 *         <Toast.Description className={cls.description}>
 *           {toast.description}
 *         </Toast.Description>
 *       )}
 *       <Toast.CloseTrigger className={cls.closeTrigger} asChild>
 *         <button aria-label="Dismiss"><XIcon /></button>
 *       </Toast.CloseTrigger>
 *     </Toast.Root>
 *   )}
 * />
 * ```
 */
export {
  Toast,
  Toaster,
  createToaster,
} from '@ark-ui/react';
