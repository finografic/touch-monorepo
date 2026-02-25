// Ambient declarations for the design-system package

// CSS file imports (styles exported from this package)
declare module '*.css' {
  const content: string;
  export default content;
}
