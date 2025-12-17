import React, { useState } from 'react';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from '@radix-ui/themes';

import type { NavItem } from 'types/nav.types';

interface DropdownNavMenuProps {
  items: NavItem[];
  onNavigate?: (path: string) => void;
  activePath?: string;
  className?: string;
}

export const DropdownNavMenu: React.FC<DropdownNavMenuProps> = ({
  items,
  onNavigate,
  activePath,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <button type="button" className={`nav-button more-button ${className}`}>
          TRANSLATIONS
          <ChevronDownIcon
            width="16"
            height="16"
            style={{ marginLeft: '0.25rem', transition: 'transform 0.2s' }}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={`more-dropdown ${className}`}>
        {items.map((item) => (
          <DropdownMenu.Item
            key={item.id}
            onClick={() => onNavigate(item.path)}
            className={activePath === item.path ? 'active' : ''}
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
