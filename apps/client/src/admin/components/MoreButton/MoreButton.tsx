import React from 'react';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from '@radix-ui/themes';

import type { NavItem } from 'types/nav.types';
import { styles } from './MoreButton.styles';

interface MoreButtonProps {
  items: NavItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  activePath?: string;
  className?: string;
  displayIcons?: boolean;
}

export const MoreButton: React.FC<MoreButtonProps> = ({
  items,
  isOpen,
  onOpenChange,
  onNavigate,
  activePath,
  className = '',
  displayIcons = false,
}) => {
  return (
    <div css={styles}>
      <DropdownMenu.Root open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger>
          <button type="button" className={`nav-button more-button ${className}`}>
            More
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
              {displayIcons && item.icon && (
                <item.icon width="16" height="16" style={{ marginRight: '0.5rem' }} />
              )}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
