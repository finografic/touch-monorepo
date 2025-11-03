import { useCallback, useEffect, useRef } from 'react';
import { KEY_PRESS } from './keypress.constants';

// Handler receives the key value (string) as its argument
type KeyPressHandler = (keyValue: string) => void;

// Tuple of [KEY_PRESS constant, handler function]
type KeyPress = [(typeof KEY_PRESS)[keyof typeof KEY_PRESS], KeyPressHandler];

export interface UseKeyPressParams {
  key: KeyPress[];
  isActive: boolean;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  onKeyPress?: (keyValue: string) => void; // Callback to notify which key was pressed (for visual feedback)
}

/**
 * Custom hook for handling keyboard input with a map of key handlers
 *
 * @example
 * ```tsx
 * useKeyPress({
 *   key: [
 *     [KEY_PRESS.DIGIT_0, handleDigitPress],
 *     [KEY_PRESS.DIGIT_1, handleDigitPress],
 *     [KEY_PRESS.BACKSPACE, handleBackspace],
 *   ],
 *   isActive: true,
 * });
 * ```
 */
export const useKeyPress = ({ key: keyMap, isActive, modifiers = {}, onKeyPress }: UseKeyPressParams) => {
  // Use refs to avoid recreating handlers on every render
  const keyMapRef = useRef(keyMap);
  const isActiveRef = useRef(isActive);
  const modifiersRef = useRef(modifiers);
  const onKeyPressRef = useRef(onKeyPress);

  // Update refs when props change
  useEffect(() => {
    keyMapRef.current = keyMap;
    isActiveRef.current = isActive;
    modifiersRef.current = modifiers;
    onKeyPressRef.current = onKeyPress;
  }, [keyMap, isActive, modifiers, onKeyPress]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActiveRef.current) return;

    // Map of event.key to KEY_PRESS constant for lookup
    const keyValueMap: Record<string, string> = {
      [KEY_PRESS.DIGIT_0]: KEY_PRESS.DIGIT_0,
      [KEY_PRESS.DIGIT_1]: KEY_PRESS.DIGIT_1,
      [KEY_PRESS.DIGIT_2]: KEY_PRESS.DIGIT_2,
      [KEY_PRESS.DIGIT_3]: KEY_PRESS.DIGIT_3,
      [KEY_PRESS.DIGIT_4]: KEY_PRESS.DIGIT_4,
      [KEY_PRESS.DIGIT_5]: KEY_PRESS.DIGIT_5,
      [KEY_PRESS.DIGIT_6]: KEY_PRESS.DIGIT_6,
      [KEY_PRESS.DIGIT_7]: KEY_PRESS.DIGIT_7,
      [KEY_PRESS.DIGIT_8]: KEY_PRESS.DIGIT_8,
      [KEY_PRESS.DIGIT_9]: KEY_PRESS.DIGIT_9,
      [KEY_PRESS.NUMPAD_0]: KEY_PRESS.DIGIT_0,
      [KEY_PRESS.NUMPAD_1]: KEY_PRESS.DIGIT_1,
      [KEY_PRESS.NUMPAD_2]: KEY_PRESS.DIGIT_2,
      [KEY_PRESS.NUMPAD_3]: KEY_PRESS.DIGIT_3,
      [KEY_PRESS.NUMPAD_4]: KEY_PRESS.DIGIT_4,
      [KEY_PRESS.NUMPAD_5]: KEY_PRESS.DIGIT_5,
      [KEY_PRESS.NUMPAD_6]: KEY_PRESS.DIGIT_6,
      [KEY_PRESS.NUMPAD_7]: KEY_PRESS.DIGIT_7,
      [KEY_PRESS.NUMPAD_8]: KEY_PRESS.DIGIT_8,
      [KEY_PRESS.NUMPAD_9]: KEY_PRESS.DIGIT_9,
      [KEY_PRESS.BACKSPACE]: KEY_PRESS.BACKSPACE,
      [KEY_PRESS.DELETE]: KEY_PRESS.BACKSPACE, // Map Delete to Backspace
      [KEY_PRESS.NUMPAD_ENTER]: KEY_PRESS.ENTER, // Map NumpadEnter to Enter
      [KEY_PRESS.ENTER]: KEY_PRESS.ENTER,
    };

    // Get the normalized key value (handles numpad -> digit mapping)
    const normalizedKey = keyValueMap[event.key];
    if (!normalizedKey) return;

    // Find the handler for this key in our map
    const keyHandler = keyMapRef.current.find(([keyConstant]) => keyConstant === normalizedKey);

    if (keyHandler) {
      const [, handler] = keyHandler;

      // Prevent default browser behavior for handled keys
      event.preventDefault();
      event.stopPropagation();

      // Notify about key press for visual feedback (for digit keys)
      if (onKeyPressRef.current && normalizedKey.match(/\d/)) {
        onKeyPressRef.current(normalizedKey);
      }

      // Call handler with the key value (the digit/character string)
      handler(normalizedKey);
    }
  }, []); // Empty deps - using refs for all values

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  return {};
};
