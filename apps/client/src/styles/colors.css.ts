import type { ColorScale, ThemeColors } from './colors.types';

function createScale(base: string): ColorScale {
  return {
    50: `${base}0A`,
    100: `${base}1A`,
    200: `${base}33`,
    300: `${base}4D`,
    400: `${base}66`,
    500: `${base}80`,
    600: `${base}99`,
    700: `${base}B3`,
    800: `${base}CC`,
    900: `${base}E6`,
  };
}

export const colors: ThemeColors = {
  primary: createScale('#3B82F6'),
  neutral: createScale('#6B7280'),
  success: createScale('#10B981'),
  warning: createScale('#F59E0B'),
  error: createScale('#EF4444'),
  info: createScale('#3B82F6'),
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    disabled: '#9CA3AF',
  },
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#9CA3AF',
  },
};
