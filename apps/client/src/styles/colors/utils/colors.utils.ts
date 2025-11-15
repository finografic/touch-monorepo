export const withOpacity = (color: string, opacity: number): string => {
  // If using OKLCH (which your system supports):
  // You'd need to parse and modify the OKLCH string
  // Or use CSS color-mix() function
  return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
};
