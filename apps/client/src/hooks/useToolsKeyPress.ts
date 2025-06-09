import { useEffect } from 'react';
import { useDev } from 'providers/DevProvider/DevContext';
import { AdminContext } from 'providers/AdminProvider/AdminContext';
import type { AdminKeys } from 'providers/AdminProvider/AdminContext';

interface AdminState {
  [AdminKeys.isAdminToolsVisible]: boolean;
  [AdminKeys.isTimerVisible]: boolean;
}

export const useToolsKeyPress = () => {
  const { isDevToolsVisible, setIsDevToolsVisible } = useDev();
  const adminStore = AdminContext.useContext();

  useEffect(() => {
    if (!adminStore) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Dev tools: Ctrl only
      if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        setIsDevToolsVisible(!isDevToolsVisible);
      }

      // Admin tools: Ctrl + Shift
      if (event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey) {
        adminStore.setState((state: AdminState) => ({
          ...state,
          isAdminToolsVisible: !state.isAdminToolsVisible,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsDevToolsVisible, isDevToolsVisible, adminStore]);
};
