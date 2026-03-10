/**
 * Dialog Recipe (Slot Recipe)
 *
 * Styling for Ark UI's Dialog compound component.
 * Ark handles all a11y: focus trap, scroll lock, Escape to close,
 * aria-modal, aria-labelledby, aria-describedby.
 *
 * Slots:
 *   backdrop     — full-viewport dimmed overlay
 *   positioner   — centers the content panel
 *   content      — the dialog panel
 *   header       — optional header row (title + close button)
 *   title        — Dialog.Title text
 *   description  — Dialog.Description text
 *   body         — scrollable body content area
 *   footer       — optional footer row (actions)
 *   closeTrigger — the × dismiss button
 *
 * Usage:
 * ```tsx
 * import { Dialog } from '@workspace/design-system/components';
 * // cls from consuming app's generated: dialogRecipe({ size: 'md' })
 *
 * <Dialog.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
 *   <Dialog.Backdrop className={cls.backdrop} />
 *   <Dialog.Positioner className={cls.positioner}>
 *     <Dialog.Content className={cls.content}>
 *       <Dialog.Header className={cls.header}>
 *         <Dialog.Title className={cls.title}>Confirm</Dialog.Title>
 *         <Dialog.CloseTrigger className={cls.closeTrigger} asChild>
 *           <button aria-label="Close"><XIcon /></button>
 *         </Dialog.CloseTrigger>
 *       </Dialog.Header>
 *       <Dialog.Body className={cls.body}>
 *         <Dialog.Description className={cls.description}>
 *           Are you sure?
 *         </Dialog.Description>
 *       </Dialog.Body>
 *       <Dialog.Footer className={cls.footer}>
 *         <Dialog.CloseTrigger asChild>
 *           <button>Cancel</button>
 *         </Dialog.CloseTrigger>
 *         <button>Confirm</button>
 *       </Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog.Positioner>
 * </Dialog.Root>
 * ```
 */
import { defineSlotRecipe } from '@pandacss/dev';

export const dialogRecipe = defineSlotRecipe({
  className: 'dialog',
  description: 'Modal dialog — accessible overlay with focus trap',

  slots: [
    'backdrop',
    'positioner',
    'content',
    'header',
    'title',
    'description',
    'body',
    'footer',
    'closeTrigger',
  ],

  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      bg: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
      zIndex: 'overlay',
      _open: { animation: 'fade-in 150ms ease' },
      _closed: { animation: 'fade-out 150ms ease' },
    },
    positioner: {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4',
      zIndex: 'modal',
    },
    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      bg: 'bg.panel',
      borderRadius: 'lg',
      boxShadow: 'lg',
      width: 'full',
      maxH: '90vh',
      overflow: 'hidden',
      _open: { animation: 'scale-in 150ms ease' },
      _closed: { animation: 'scale-out 150ms ease' },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '4',
      paddingInline: '6',
      paddingBlock: '4',
      borderBottomWidth: 'light',
      borderBottomStyle: 'solid',
      borderBottomColor: 'border.subtle',
      flexShrink: 0,
    },
    title: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      color: 'fg',
      lineHeight: 'tight',
    },
    description: {
      fontSize: 'sm',
      color: 'fg.muted',
      lineHeight: 'normal',
    },
    body: {
      flex: '1',
      overflowY: 'auto',
      padding: '6',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '3',
      paddingInline: '6',
      paddingBlock: '4',
      borderTopWidth: 'light',
      borderTopStyle: 'solid',
      borderTopColor: 'border.subtle',
      flexShrink: 0,
    },
    closeTrigger: {
      cursor: 'pointer',
      color: 'fg.muted',
      borderRadius: 'sm',
      _hover: { color: 'fg', bg: 'bg.subtle' },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },
  },

  variants: {
    size: {
      sm: { content: { maxW: '24rem' } },
      md: { content: { maxW: '32rem' } },
      lg: { content: { maxW: '48rem' } },
      xl: { content: { maxW: '64rem' } },
      full: {
        positioner: { padding: '0' },
        content: { maxW: 'full', maxH: 'full', borderRadius: 'none' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
