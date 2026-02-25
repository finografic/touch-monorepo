import React, { forwardRef } from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

/** Convert PascalCase export name to kebab-case icon identifier.
 *  e.g. 'ChevronDownIcon' → 'chevron-down'
 */
function toIconName(exportName: string): string {
  return exportName
    .replace(/Icon$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Wraps a Lucide (or any SVG) component with:
 *  - `.icon` class  (picks up global icon sizing from global.css)
 *  - `.icon-name--{kebab}` class  (useful for CSS targeting / debugging)
 *  - `data-icon-name` attribute
 *  - forwarded ref + displayName
 *
 * No external deps — className merge is done inline.
 */
export const createIconWrapper = (
  IconComponent: React.ComponentType<IconProps>,
  exportName?: string,
) => {
  const iconName = exportName ? toIconName(exportName) : 'unknown';

  const WrappedIcon = forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => {
    const cls = ['icon', `icon-name--${iconName}`, className].filter(Boolean).join(' ');
    return React.createElement(IconComponent, {
      ref,
      className: cls,
      'data-icon-name': iconName,
      ...props,
    });
  });

  WrappedIcon.displayName = `Icon(${
    exportName ?? (IconComponent as any).displayName ?? (IconComponent as any).name ?? 'Unknown'
  })`;

  return WrappedIcon;
};
