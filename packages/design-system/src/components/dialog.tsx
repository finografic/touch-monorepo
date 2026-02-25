/**
 * Dialog Component
 *
 * Typed wrapper around Ark UI Dialog.
 * Ark handles all a11y: focus trap, scroll lock, Escape to close,
 * aria-modal, aria-labelledby, aria-describedby.
 *
 * Styling comes from `dialogRecipe` applied per slot via `className`.
 *
 * Usage:
 * ```tsx
 * import { Dialog } from '@workspace/design-system/components';
 * // cls from consuming app's generated: dialogRecipe({ size: 'md' })
 *
 * <Dialog.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
 *   <Dialog.Trigger asChild>
 *     <button>Open</button>
 *   </Dialog.Trigger>
 *
 *   <Dialog.Backdrop className={cls.backdrop} />
 *   <Dialog.Positioner className={cls.positioner}>
 *     <Dialog.Content className={cls.content}>
 *
 *       <Dialog.Header className={cls.header}>
 *         <Dialog.Title className={cls.title}>Confirm action</Dialog.Title>
 *         <Dialog.CloseTrigger className={cls.closeTrigger} asChild>
 *           <button aria-label="Close"><XIcon /></button>
 *         </Dialog.CloseTrigger>
 *       </Dialog.Header>
 *
 *       <Dialog.Body className={cls.body}>
 *         <Dialog.Description className={cls.description}>
 *           This action cannot be undone.
 *         </Dialog.Description>
 *       </Dialog.Body>
 *
 *       <Dialog.Footer className={cls.footer}>
 *         <Dialog.CloseTrigger asChild>
 *           <button>Cancel</button>
 *         </Dialog.CloseTrigger>
 *         <button>Confirm</button>
 *       </Dialog.Footer>
 *
 *     </Dialog.Content>
 *   </Dialog.Positioner>
 * </Dialog.Root>
 * ```
 */
import { Dialog as ArkDialog } from '@ark-ui/react';
import type { ComponentPropsWithoutRef } from 'react';

// ── Re-export all Ark Dialog parts ───────────────────────────────────────────
// Ark provides: Root, Trigger, Backdrop, Positioner, Content,
//               Title, Description, CloseTrigger
export const Dialog = {
  Root:         ArkDialog.Root,
  Trigger:      ArkDialog.Trigger,
  Backdrop:     ArkDialog.Backdrop,
  Positioner:   ArkDialog.Positioner,
  Content:      ArkDialog.Content,
  Title:        ArkDialog.Title,
  Description:  ArkDialog.Description,
  CloseTrigger: ArkDialog.CloseTrigger,

  // ── Structural layout divs (not in Ark — our additions) ──────────────────
  // These carry no Ark state; they're simple divs for consistent layout.
  // Apply cls.header / cls.body / cls.footer from the dialogRecipe.

  /** Header row — title + close button side by side */
  Header: ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
    <div data-part="header" className={className} {...props} />
  ),

  /** Scrollable body / main content area */
  Body: ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
    <div data-part="body" className={className} {...props} />
  ),

  /** Footer row — action buttons */
  Footer: ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
    <div data-part="footer" className={className} {...props} />
  ),
} as const;
