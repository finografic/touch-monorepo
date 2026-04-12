/**
 * Remove modal/scroll-lock side effects that sometimes stay on `document` after
 * Ark/Radix-style dialogs close (especially when the dialog unmounts in one step
 * without an intermediate `open={false}` render).
 */
export const cleanupDialogBodyAttributes = (): void => {
  const body = document.body;
  const html = document.documentElement;

  if (body.style.pointerEvents === 'none') {
    body.style.pointerEvents = '';
  }

  if (body.style.overflow === 'hidden') {
    body.style.overflow = '';
  }

  // Ark UI / design-system (current)
  body.removeAttribute('data-scroll-lock');
  body.removeAttribute('data-inert');
  // Radix / older stacks
  body.removeAttribute('data-scroll-locked');
  body.removeAttribute('data-aria-hidden');

  if (html.style.getPropertyValue('--scrollbar-width')) {
    html.style.removeProperty('--scrollbar-width');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaned up dialog body / html scroll-lock attributes');
  }
};
