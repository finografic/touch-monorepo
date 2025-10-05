import type { ScreenClass } from 'styles/viewport/viewport.types';

export type SizeUI = Extract<ScreenClass, 'sm' | 'md' | 'lg'>;

export type Theme = 'light' | 'dark';
