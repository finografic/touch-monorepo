import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMetadata } from 'providers/MetadataProvider';
import { useTimers } from 'providers/TimersProvider';

/** Throttle pointermove while the overlay is up (dismiss path only). */
const POINTER_MOVE_THROTTLE_MS = 200;

/**
 * Tracks user activity and shows a fullscreen overlay after `inactivityMs` with no input.
 * Mouse movement does not reset the idle timer until the overlay is visible; then pointermove dismisses it.
 * Other activity (pointer down, keys, wheel, touch, scroll) resets idle while the overlay is hidden.
 * The idle countdown runs only when both `selectedSlots` and `timers` are empty; otherwise the overlay is blocked.
 */
export function useScreensaver(inactivityMs: number) {
  const { selectedSlots } = useMetadata();
  const { timers } = useTimers();
  const hasBlockingState = useMemo(
    () => selectedSlots.length > 0 || timers.length > 0,
    [selectedSlots, timers],
  );

  const [visible, setVisible] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPointerMoveRef = useRef(0);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const scheduleIdle = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, inactivityMs);
  }, [inactivityMs, clearIdleTimer]);

  const resetIdle = useCallback(() => {
    setVisible(false);
    if (hasBlockingState) {
      clearIdleTimer();
      return;
    }
    scheduleIdle();
  }, [scheduleIdle, clearIdleTimer, hasBlockingState]);

  useEffect(() => {
    if (hasBlockingState) {
      clearIdleTimer();
      setVisible(false);
      return;
    }
    scheduleIdle();
  }, [hasBlockingState, clearIdleTimer, scheduleIdle]);

  useEffect(() => {
    const listenerOpts: AddEventListenerOptions = { capture: true, passive: true };

    const onActivity = () => {
      resetIdle();
    };

    window.addEventListener('pointerdown', onActivity, listenerOpts);
    window.addEventListener('keydown', onActivity, listenerOpts);
    window.addEventListener('wheel', onActivity, listenerOpts);
    window.addEventListener('touchstart', onActivity, listenerOpts);
    document.addEventListener('scroll', onActivity, { capture: true, passive: true });

    return () => {
      clearIdleTimer();
      window.removeEventListener('pointerdown', onActivity, listenerOpts);
      window.removeEventListener('keydown', onActivity, listenerOpts);
      window.removeEventListener('wheel', onActivity, listenerOpts);
      window.removeEventListener('touchstart', onActivity, listenerOpts);
      document.removeEventListener(
        'scroll',
        onActivity,
        { capture: true, passive: true } as AddEventListenerOptions,
      );
    };
  }, [scheduleIdle, clearIdleTimer, resetIdle]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const listenerOpts: AddEventListenerOptions = { capture: true, passive: true };

    const onPointerMove = () => {
      const now = Date.now();
      if (now - lastPointerMoveRef.current < POINTER_MOVE_THROTTLE_MS) {
        return;
      }
      lastPointerMoveRef.current = now;
      resetIdle();
    };

    window.addEventListener('pointermove', onPointerMove, listenerOpts);

    return () => {
      window.removeEventListener('pointermove', onPointerMove, listenerOpts);
    };
  }, [visible, resetIdle]);

  return { visible, dismiss: resetIdle };
}
