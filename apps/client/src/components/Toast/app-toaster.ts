import { createToaster } from '@finografic/design-system/components';

/**
 * Single toast store for the app — matches prior fixed bottom-right placement (offset up from kiosk chrome).
 */
export const appToaster = createToaster({
  placement: 'bottom-end',
  gap: 12,
  /** ≥ exit animation (150ms) so Zag does not unmount mid-frame; fill-mode still holds final opacity. */
  removeDelay: 220,
  offsets: {
    bottom: '150px',
    right: '10px',
    top: '0',
    left: '0',
  },
});
