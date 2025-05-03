import { useEffect } from 'react';
import { useDev } from 'providers/DevProvider/DevContext';

// TODO: MAKE THIS HOOK *GENERIC* !!
// PASS: `{key: CONTROL, toggle: isDevToolsVisible }` 👍🏼

export const useKeyPress = () => {
  // const { isDevToolsVisible, setIsDevToolsVisible } = useDev();
  const { isDevDataVisible, setIsDevDataVisible } = useDev();
  useKeyPress();

  const handleEvent = (e: KeyboardEvent) => {
    if (process.env.NODE_ENV !== 'production' && e.key === 'Control') {
      setIsDevDataVisible(!isDevDataVisible);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEvent);

    return () => window.removeEventListener('keydown', handleEvent);
  }, [isDevDataVisible]);
};
