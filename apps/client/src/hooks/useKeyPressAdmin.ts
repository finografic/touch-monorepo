import { useEffect } from 'react';

import { useDev } from 'dev-tools/providers/DevProvider/DevContext';

export const useKeyPressAdmin = () => {
  const {
    isDevToolsVisible,
    setIsDevToolsVisible,
    isDevScreenSizeVisible,
    setIsDevScreenSizeVisible,
    isDevDataVisible,
    setIsDevDataVisible,
  } = useDev();

  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore events from editable elements — let inputs handle their own keys
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) return;

    // Debug logging
    if (event.key === '?' || event.key === 'Control') {
      console.debug('Key Event:', {
        key: event.key,
        code: event.code,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey,
      });
    }

    // Dev tools: Ctrl only
    if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
      setIsDevToolsVisible(!isDevToolsVisible);
      setIsDevDataVisible(!isDevDataVisible);
      setIsDevScreenSizeVisible(!isDevScreenSizeVisible);
    }

    // Admin tools: Shift + / (question mark)
    // Using Shift + / as it's a common shortcut for help/tools interfaces
    if (event.key === '?' && !event.ctrlKey && !event.altKey && event.shiftKey && !event.metaKey) {
      // console.debug('ADMIN TOOLS:', isAdminToolsVisible);
      // setIsAdminToolsVisible(!isAdminToolsVisible);
      // Prevent the question mark from being typed
      event.preventDefault();
    }
  };

  useEffect(() => {
    // Use document instead of window for better keyboard event handling
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDevToolsVisible, isDevScreenSizeVisible]);
};
