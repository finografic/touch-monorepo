import { useCallback, useEffect } from 'react';
import type { KEY_PRESS } from '@workspace/core';

type KeyPress = [(typeof KEY_PRESS)[keyof typeof KEY_PRESS], (event: KeyboardEvent) => void];

export interface UseKeyPressParams {
  key: KeyPress[];
  isActive: boolean;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

export const useKeyPress = ({ key, isActive, modifiers = {} }: UseKeyPressParams) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!key.includes(event.key)) return;

      const modifiersMatch =
        (!modifiers.ctrl || event.ctrlKey) &&
        (!modifiers.alt || event.altKey) &&
        (!modifiers.shift || event.shiftKey) &&
        (!modifiers.meta || event.metaKey);

      if (!modifiersMatch) return;

      console.log('KEY_DOWN', 'cyan', { key: event.key, modifiersMatch });
    },
    [key, isActive, modifiers],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {};
};
