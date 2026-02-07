import React, { forwardRef } from 'react';

import clsx from 'clsx';

/**
 * Convert PascalCase to kebab-case (Lucide convention)
 * Examples: 'ChevronDown' -> 'chevron-down'
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Derive Lucide-style kebab name from our export name (e.g. ChevronDownIcon -> chevron-down) */
function toIconName(exportName: string): string {
  return toKebabCase(exportName.replace(/Icon$/, ''));
}

export const createIconWrapper = (IconComponent: React.ComponentType<any>, exportName?: string) => {
  const iconName = exportName ? toIconName(exportName) : 'unknown';

  const WrappedIcon = forwardRef<any, any>(({ className, ...props }, ref) => {
    return React.createElement(IconComponent, {
      ref,
      'className': clsx('icon', `icon-name--${iconName}`, className),
      'data-icon-name': iconName,
      ...props,
    });
  });

  WrappedIcon.displayName = `Icon(${exportName ?? IconComponent.displayName ?? IconComponent.name ?? 'Unknown'})`;

  return WrappedIcon;
};
