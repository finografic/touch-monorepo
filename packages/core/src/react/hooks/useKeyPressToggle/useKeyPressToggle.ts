import { useCallback, useEffect } from 'react';

export interface UseKeyPressToggleParams {
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

// Main hook implementation
export const useKeyPressToggle = ({
  key,
  isActive,
  setIsActive,
  modifiers = {},
}: UseKeyPressToggleParams) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== key) return;

      const modifiersMatch =
        (!modifiers.ctrl || event.ctrlKey) &&
        (!modifiers.alt || event.altKey) &&
        (!modifiers.shift || event.shiftKey) &&
        (!modifiers.meta || event.metaKey);

      if (!modifiersMatch) return;

      setIsActive(!isActive);
    },
    [key, isActive, setIsActive, modifiers],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {};
};
