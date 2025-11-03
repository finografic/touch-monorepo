import { useCallback, useEffect } from 'react';

export interface UseKeyPressParams {
  key: string;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

export const useKeyPress = ({ key, isActive, setIsActive, modifiers = {} }: UseKeyPressParams) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== key) return;

      const modifiersMatch =
        (!modifiers.ctrl || event.ctrlKey) &&
        (!modifiers.alt || event.altKey) &&
        (!modifiers.shift || event.shiftKey) &&
        (!modifiers.meta || event.metaKey);

      if (!modifiersMatch) return;

      // setIsActive(!isActive);
      console.log('KEY_DOWN', 'cyan', { key: event.key, modifiersMatch });
    },
    [key, isActive, setIsActive, modifiers],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {};
};
