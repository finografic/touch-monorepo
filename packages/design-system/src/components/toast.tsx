/**
 * Toast Component
 *
 * Ark UI Toast primitive — accessible toast notifications.
 *
 * Usage:
 * ```tsx
 * import { Toast, Toaster, createToaster } from '@workspace/design-system/components';
 *
 * const toaster = createToaster({ placement: 'top-end' });
 *
 * // In your app root:
 * <Toaster toaster={toaster} />
 *
 * // To show a toast:
 * toaster.create({ title: 'Saved', description: 'Configuration saved.' });
 * ```
 */
export { Toast, Toaster, createToaster } from '@ark-ui/react';
