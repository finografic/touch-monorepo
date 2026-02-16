/**
 * Dialog Component
 *
 * Ark UI Dialog primitive — accessible modal with focus trap,
 * scroll lock, and keyboard dismiss (Escape).
 *
 * Usage:
 * ```tsx
 * import { Dialog } from '@workspace/design-system/components';
 *
 * <Dialog.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
 *   <Dialog.Trigger asChild>
 *     <button>Open dialog</button>
 *   </Dialog.Trigger>
 *   <Dialog.Backdrop className="dialog-backdrop" />
 *   <Dialog.Positioner>
 *     <Dialog.Content className="dialog-content">
 *       <Dialog.Title>Confirm action</Dialog.Title>
 *       <Dialog.Description>Are you sure?</Dialog.Description>
 *       <Dialog.CloseTrigger asChild>
 *         <button>Close</button>
 *       </Dialog.CloseTrigger>
 *     </Dialog.Content>
 *   </Dialog.Positioner>
 * </Dialog.Root>
 * ```
 */
import { Dialog as ArkDialog } from '@ark-ui/react';

// Re-export all Ark UI Dialog parts directly.
// No wrapper needed — Ark handles a11y, we just re-export for consistency.
export const Dialog = ArkDialog;
