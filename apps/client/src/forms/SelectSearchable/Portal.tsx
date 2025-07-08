import type React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Try to find existing container
    let container = document.getElementById(containerId) as HTMLDivElement;

    // Create container if it doesn't exist
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '999999';
      container.style.pointerEvents = 'none'; // Allow clicks to pass through
      document.body.appendChild(container);
    }

    containerRef.current = container;

    return () => {
      // Only remove if we created it and it's empty
      if (container && container.children.length === 0 && container.id === containerId) {
        container.remove();
      }
    };
  }, [containerId]);

  if (!containerRef.current) {
    return null;
  }

  return createPortal(children, containerRef.current);
};
