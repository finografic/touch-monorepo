import type { BreakpointMap } from 'styles/viewport/viewport.types';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';

export const MORE_BUTTON_WIDTH = 120; // Reserve space for More button
export const GAP = 8; // Gap between items (0.5rem = 8px)

// Legacy constant for backward compatibility
export const PADDING = 40;

// Responsive navbar configuration per breakpoint
export interface NavbarBreakpointConfig {
  maxWidth: number | `${number}%` | `${number}vw`; // Use actual breakpoint value, or 100 for 100% of container
  padding: number;
}

export const NAVBAR_BREAKPOINT_CONFIG: BreakpointMap<NavbarBreakpointConfig> = {
  xs: {
    maxWidth: '100%', // 100% of container (no fixed max at xs)
    padding: 16, // Less aggressive padding on mobile
  },
  sm: {
    maxWidth: '100%', // 100% of container
    padding: 20,
  },
  md: {
    maxWidth: '100%', // 100% of container
    padding: 24,
  },
  lg: {
    maxWidth: '200vw', // 100% of container
    padding: 32,
  },
  xl: {
    maxWidth: '150vw', // 100% of container
    padding: 40,
  },
  xxl: {
    maxWidth: BREAKPOINTS.xxl, // Use actual xxl breakpoint value (1640px)
    padding: 40,
  },
} as const;
