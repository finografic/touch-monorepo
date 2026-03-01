export type { IconComponent, IconName } from './icons';
export { ICON_NAMES, icons } from './icons';

// Expose wrapper factory for consumers who need to register app-specific icons
export type { IconProps } from './icons.utils';
export { createIconWrapper } from './icons.utils';
