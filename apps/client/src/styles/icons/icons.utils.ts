import React, { forwardRef } from 'react';

import clsx from 'clsx';

/**
 * Convert PascalCase to kebab-case
 * Examples: 'ChevronDownIcon' -> 'chevron-down-icon'
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Extract original icon name from import alias for metadata
 * Examples: '_ChevronDownIcon' -> 'chevron-down-icon'
 * This preserves the actual Radix/Lucide naming for reference
 */
function extractOriginalName(componentName: string): string {
  // Remove leading underscore if present (from import aliases like _ChevronDownIcon)
  const cleanName = componentName.replace(/^_/, '');
  return toKebabCase(cleanName);
}

/**
 * Generate semantic class name from our export name
 * Examples: 'DropdownIcon' -> 'dropdown-icon'
 */
function generateSemanticName(exportName: string): string {
  return toKebabCase(exportName);
}

/**
 * Enhanced helper function to create icon wrapper with:
 * - Auto-className (.icon)
 * - Semantic class names based on our export names
 * - Original Radix/Lucide names as metadata in data attributes
 * - Proper displayName for debugging
 */
export const createIconWrapper = (IconComponent: React.ComponentType<any>, exportName?: string) => {
  const WrappedIcon = forwardRef<any, any>(({ className, ...props }, ref) => {
    // Get the original component name (from Radix/Lucide)
    const originalComponentName = IconComponent.displayName || IconComponent.name || 'Unknown';
    const originalKebabName = extractOriginalName(originalComponentName);

    // Generate semantic name from our export name (e.g., 'DropdownIcon' -> 'dropdown-icon')
    const semanticName = exportName ? generateSemanticName(exportName) : originalKebabName;

    return React.createElement(IconComponent, {
      ref,
      'className': clsx(
        'icon',
        `icon-name--${semanticName}`, // Our semantic naming
        semanticName, // Also add directly as class
        className,
      ),
      'data-icon-name': semanticName, // Our semantic name
      'data-icon-original': originalKebabName, // Original Radix/Lucide name for metadata
      'data-icon-source': originalComponentName, // Raw component name
      ...props,
    });
  });

  // Preserve the original component name for debugging
  const componentName = IconComponent.displayName || IconComponent.name || 'Unknown';
  WrappedIcon.displayName = `Icon(${componentName})`;

  return WrappedIcon;
};
