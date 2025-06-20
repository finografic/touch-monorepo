import type React from 'react';

export interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface DialogConfig {
  title: string;
  tabs: TabConfig[];
  size?: '1' | '2' | '3' | '4';
  maxWidth?: string; // e.g., '800px', '50vw', '90%'
  maxHeight?: string; // e.g., '600px', '80vh', '90%'
  minWidth?: string; // e.g., '320px', '30vw'
  minHeight?: string; // e.g., '300px', '40vh'
  theme?: {
    appearance?: 'light' | 'dark';
    grayColor?: 'auto' | 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
    accentColor?:
      | 'blue'
      | 'ruby'
      | 'gray'
      | 'gold'
      | 'bronze'
      | 'brown'
      | 'yellow'
      | 'amber'
      | 'orange'
      | 'tomato'
      | 'red'
      | 'crimson'
      | 'pink'
      | 'plum'
      | 'purple'
      | 'violet'
      | 'iris'
      | 'indigo'
      | 'cyan'
      | 'teal'
      | 'jade'
      | 'green'
      | 'grass'
      | 'lime'
      | 'mint'
      | 'sky';
    scaling?: '90%' | '95%' | '100%' | '105%' | '110%';
  };
  footer?: {
    primaryButton?: {
      label: string;
      onClick: () => void;
      variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
      color?:
        | 'blue'
        | 'ruby'
        | 'gray'
        | 'gold'
        | 'bronze'
        | 'brown'
        | 'yellow'
        | 'amber'
        | 'orange'
        | 'tomato'
        | 'red'
        | 'crimson'
        | 'pink'
        | 'plum'
        | 'purple'
        | 'violet'
        | 'iris'
        | 'indigo'
        | 'cyan'
        | 'teal'
        | 'jade'
        | 'green'
        | 'grass'
        | 'lime'
        | 'mint'
        | 'sky';
    };
    secondaryButton?: {
      label: string;
      onClick: () => void;
      variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
      color?:
        | 'blue'
        | 'ruby'
        | 'gray'
        | 'gold'
        | 'bronze'
        | 'brown'
        | 'yellow'
        | 'amber'
        | 'orange'
        | 'tomato'
        | 'red'
        | 'crimson'
        | 'pink'
        | 'plum'
        | 'purple'
        | 'violet'
        | 'iris'
        | 'indigo'
        | 'cyan'
        | 'teal'
        | 'jade'
        | 'green'
        | 'grass'
        | 'lime'
        | 'mint'
        | 'sky';
    };
  };
}
