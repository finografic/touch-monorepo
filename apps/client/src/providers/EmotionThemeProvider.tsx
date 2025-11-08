/**
 * Emotion Theme Provider
 * Manages theme switching and provides theme context to Emotion-styled components
 *
 * 🎨 Now using OKLCH color space for better perceptual uniformity!
 */

import { ThemeProvider } from '@emotion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { oklchLightTheme as lightTheme, oklchDarkTheme as darkTheme } from 'styles/themes/generate-oklch-themes';

interface EmotionThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages Emotion theme based on data-theme attribute
 */
export const EmotionThemeProvider = ({ children }: EmotionThemeProviderProps) => {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    // Set initial theme based on document attribute
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? darkTheme : lightTheme);
    };

    // Set initial theme
    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

