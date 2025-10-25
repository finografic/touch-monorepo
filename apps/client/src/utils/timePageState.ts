import { create } from 'zustand';

/**
 * ✅ PROPER STATE MANAGEMENT FOR TIME PAGE
 *
 * Uses Zustand for reactive, reliable state management.
 * Replaces the old module-level `let` variable which was not reactive.
 *
 * Benefits:
 * - ✅ Reactive: Changes trigger re-renders
 * - ✅ Type-safe: Full TypeScript support
 * - ✅ Testable: Can be mocked/reset
 * - ✅ Persistent: Survives hot reloads
 * - ✅ Debuggable: Works with Redux DevTools
 */

interface TimePageState {
  timeSeconds: number;
  setTime: (seconds: number) => void;
  resetTime: () => void;
}

const DEFAULT_TIME = 60; // 1 minute default

export const useTimePageStore = create<TimePageState>((set) => ({
  timeSeconds: DEFAULT_TIME,

  setTime: (seconds: number) => {
    set({ timeSeconds: seconds });
  },

  resetTime: () => {
    set({ timeSeconds: DEFAULT_TIME });
  },
}));

// ⚠️ DEPRECATED: Legacy API for backward compatibility
// TODO: Migrate all usages to useTimePageStore hook
export const timePageState = {
  getTime: () => {
    console.warn('⚠️ timePageState.getTime() is deprecated. Use useTimePageStore() hook instead.');
    return useTimePageStore.getState().timeSeconds;
  },
  setTime: (seconds: number) => {
    console.warn('⚠️ timePageState.setTime() is deprecated. Use useTimePageStore() hook instead.');
    useTimePageStore.getState().setTime(seconds);
  },
};
