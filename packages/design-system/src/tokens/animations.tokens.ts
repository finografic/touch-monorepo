/**
 * 🎬 Animation Tokens
 *
 * Keyframes and transition durations for the design system.
 */

// ============================================================================
// KEYFRAMES
// ============================================================================

export const keyframes = {
  'slide-fade-in': {
    '0%': { opacity: '0', transform: 'translateY(-8px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-fade-out': {
    '0%': { opacity: '1', transform: 'translateY(0)' },
    '100%': { opacity: '0', transform: 'translateY(-8px)' },
  },
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'fade-out': {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  'scale-out': {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.95)' },
  },
  'slide-in-right': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  'slide-out-right': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(100%)' },
  },
} as const;

// ============================================================================
// DURATIONS
// ============================================================================

export const durationTokens = {
  fastest: { value: '50ms' },
  faster: { value: '100ms' },
  fast: { value: '150ms' },
  normal: { value: '200ms' },
  slow: { value: '300ms' },
  slower: { value: '400ms' },
  slowest: { value: '500ms' },
} as const;

// ============================================================================
// EASINGS
// ============================================================================

export const easingTokens = {
  'default': { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  'in': { value: 'cubic-bezier(0.4, 0, 1, 1)' },
  'out': { value: 'cubic-bezier(0, 0, 0.2, 1)' },
  'in-out': { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
} as const;
