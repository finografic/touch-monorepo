import React, { useEffect, useRef, useState } from 'react';
import { Portal } from './Portal';
import type { SerializedStyles } from '@emotion/react';

interface DropdownPortalProps {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  css?: SerializedStyles; // Add css prop for styling
}

export const DropdownPortal: React.FC<DropdownPortalProps> = ({
  children,
  triggerRef,
  isOpen,
  onClose,
  className = '',
  css: cssStyles, // Rename to avoid conflicts
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position based on trigger element
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      setPosition({
        top: rect.bottom + scrollTop + 4, // 4px gap
        left: rect.left + scrollLeft,
        width: rect.width,
      });
    };

    updatePosition();

    // Update position on scroll and resize
    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, triggerRef]);

  // Handle clicks outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(target);

      if (isOutsideDropdown && isOutsideTrigger) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={dropdownRef}
        className={`dropdown-portal ${className}`}
        css={cssStyles} // Apply the CSS styles here
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: position.width,
          zIndex: 999999,
          pointerEvents: 'auto', // Re-enable pointer events for the dropdown
        }}
      >
        {children}
      </div>
    </Portal>
  );
};
