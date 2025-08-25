import { useEffect } from 'react';
import { useDevGuides } from './DevGuidesContext';
// import { useAdmin } from 'providers/AdminProvider/AdminContext';

export const useKeyPressGuides = () => {
  const { isDevGuidesVisibile, setIsDevGuidesVisibile } = useDevGuides();

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
      setIsDevGuidesVisibile(!isDevGuidesVisibile);
    }

    // Admin tools: Shift + / (question mark)
    // Using Shift + / as it's a common shortcut for help/tools interfaces
    if (event.key === '?' && !event.ctrlKey && !event.altKey && event.shiftKey && !event.metaKey) {
      console.debug('ADMIN TOOLS:', isDevGuidesVisibile);
      setIsDevGuidesVisibile(!isDevGuidesVisibile);
      // Prevent the question mark from being typed
      event.preventDefault();
    }
  };

  useEffect(() => {
    // Use document instead of window for better keyboard event handling
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDevGuidesVisibile]);
};
