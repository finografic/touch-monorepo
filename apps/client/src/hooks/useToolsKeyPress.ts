import { useEffect } from 'react';
import { useDev } from 'providers/DevProvider/DevContext';
import { useAdmin } from 'providers/AdminProvider/AdminContext';

export const useToolsKeyPress = () => {
  const { isDevToolsVisible, setIsDevToolsVisible } = useDev();
  const { isAdminToolsVisible, setIsAdminToolsVisible } = useAdmin();

  const handleKeyDown = (event: KeyboardEvent) => {
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
      console.debug('DEV TOOLS:', isDevToolsVisible);
      setIsDevToolsVisible(!isDevToolsVisible);
    }

    // Admin tools: Shift + / (question mark)
    // Using Shift + / as it's a common shortcut for help/tools interfaces
    if (event.key === '?' && !event.ctrlKey && !event.altKey && event.shiftKey && !event.metaKey) {
      console.debug('ADMIN TOOLS:', isAdminToolsVisible);
      setIsAdminToolsVisible(!isAdminToolsVisible);
      // Prevent the question mark from being typed
      event.preventDefault();
    }
  };

  useEffect(() => {
    // Use document instead of window for better keyboard event handling
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDevToolsVisible, isAdminToolsVisible]);
};
