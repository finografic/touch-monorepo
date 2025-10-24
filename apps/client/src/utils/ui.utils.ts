/**
 * 🧹 Clean up Radix Dialog body attributes that may persist after dialog closes
 */
export const cleanupDialogBodyAttributes = (): void => {
  const body = document.body;

  if (body.style.pointerEvents === 'none') {
    body.style.pointerEvents = '';
  }

  if (body.hasAttribute('data-scroll-locked')) {
    body.removeAttribute('data-scroll-locked');
  }

  // Also check for data-aria-hidden attribute (sometimes added by Radix)
  if (body.hasAttribute('data-aria-hidden')) {
    body.removeAttribute('data-aria-hidden');
  }

  // Log cleanup for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaned up dialog body attributes');
  }
};

/**
 * 🧹 Clean up Radix Dialog body attributes that may persist after dialog closes
 */
export const setDialogOpenAttributes = (): void => {
  /*
  const body = document.body;

  if (body.style.pointerEvents === 'none') {
    body.style.pointerEvents = '';
  }

  if (body.hasAttribute('data-scroll-locked')) {
    body.removeAttribute('data-scroll-locked');
  }

  // Also check for data-aria-hidden attribute (sometimes added by Radix)
  if (body.hasAttribute('data-aria-hidden')) {
    body.removeAttribute('data-aria-hidden');
  }

  // Log cleanup for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaned up dialog body attributes');
  }
  */
};
