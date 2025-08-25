import { useEffect } from 'react';

interface UseKeyPressGuidesProps {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  keyCode: string;
}

export const useKeyPressGuides = ({ isActive, setIsActive, keyCode }: UseKeyPressGuidesProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
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

    if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
      setIsActive(!isActive);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
};
