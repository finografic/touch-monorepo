import React from 'react';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from '@radix-ui/themes';

import type { NavItem } from 'types/nav.types';

interface DropdownNavButtonProps {
  item: NavItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  activePath?: string;
  isTransitioning?: boolean;
}

export const DropdownNavButton: React.FC<DropdownNavButtonProps> = ({
  item,
  isOpen,
  onOpenChange,
  onNavigate,
  activePath,
  isTransitioning = false,
}) => {
  // Check if any child is active
  const isActive = item.children?.some((child) => child.path === activePath) || item.path === activePath;

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className={`nav-button ${isActive ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
          disabled={isTransitioning}
        >
          {item.icon && <item.icon width="16" height="16" style={{ marginRight: '0.5rem' }} />}
          {item.label}
          <ChevronDownIcon
            width="16"
            height="16"
            style={{ marginLeft: '0.5rem', transition: 'transform 0.2s' }}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="nav-dropdown">
        {item.children?.map((child) => (
          <DropdownMenu.Item
            key={child.id}
            onClick={() => onNavigate(child.path)}
            className={activePath === child.path ? 'active' : ''}
          >
            {child.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

