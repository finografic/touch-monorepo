// All Radix color scale names we're using
export type RadixColorName =
  | 'gray' // greys
  | 'slate' // greys
  | 'sand' // greys
  | 'red' // reds
  | 'crimson' // pinks
  | 'purple' // purples
  | 'indigo' // blues
  | 'blue' // blues
  | 'sky' // blues
  | 'cyan' // blues
  | 'green' // greens
  | 'teal' // greens
  | 'grass' // greens
  | 'jade' // greens
  | 'lime' // greens
  | 'amber' // yellows
  | 'gold' // yellows
  | 'orange'; // oranges

// Radix shade values (1-12)
export type RadixShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Type for CSS variable name in Radix format
export type RadixColorVariable = `--${RadixColorName}-${RadixShade}`;

// Type for a complete Radix color with all shades
export type RadixColorWithShades = {
  [shade in RadixShade]: string;
};
