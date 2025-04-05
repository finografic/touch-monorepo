export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ColorScale = {
  [key in ColorShade]: string;
};

export interface ThemeColors {
  primary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
  // Semantic colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: {
    light: string;
    default: string;
    dark: string;
  };
}
