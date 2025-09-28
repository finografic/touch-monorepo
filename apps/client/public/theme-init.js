// Theme initialization script - runs before React
// This prevents theme flashing by setting the theme immediately
(function () {
  // Get theme from localStorage or default to 'light'
  const storedTheme = localStorage.getItem('touch-app-theme');
  const theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'light';

  // Set data-theme attribute immediately
  document.documentElement.setAttribute('data-theme', theme);

  // Store the theme if it wasn't already stored
  if (!storedTheme) {
    localStorage.setItem('touch-app-theme', theme);
  }
})();
