import React, { useCallback, useState } from 'react';

import { Dialog } from '@workspace/design-system/forms';
import { Tabs } from '@workspace/design-system/components';
import { Flex } from 'styled-system/jsx';
import clsx from 'clsx';

import { Button } from 'components/Button';
import type { DialogConfig } from 'components/Dialog/GenericDialog.types';
import { CloseIcon } from 'styles/icons';
import { styles } from './GenericDialog.styles';

interface GenericDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: DialogConfig;
  className?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export const GenericDialog: React.FC<GenericDialogProps> = ({
  isOpen,
  onClose,
  config,
  className,
  defaultTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || config.tabs[0]?.id || '');

  const hasTabs = config.tabs.length > 1;
  const currentTab = config.tabs.find((tab) => tab.id === activeTab) || config.tabs[0];
  const hasTitle = Boolean(config.title);

  const dynamicStyles = {
    ...(config.maxWidth && { maxWidth: config.maxWidth }),
    ...(config.maxHeight && { maxHeight: config.maxHeight }),
    ...(config.minWidth && { minWidth: config.minWidth }),
    ...(config.minHeight && { minHeight: config.minHeight }),
  };

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      onTabChange?.(value);
    },
    [onTabChange],
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          size={config.size || 'md'}
          className={clsx('dialog-content', className)}
          css={styles}
          style={dynamicStyles}
        >
          {/* HEADER =========================================================== */}

          <Dialog.Header className={clsx('dialog-header', { 'has-title': hasTitle })}>
            <Dialog.Title className={hasTitle ? undefined : 'sr-only'}>
              {config.title || 'Dialog'}
              {config.subtitle && <span className="subtitle"> {config.subtitle}</span>}
            </Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="close-button"
                aria-label="Close dialog"
              >
                <CloseIcon />
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>

          {/* Accessible description for screen readers */}
          <Dialog.Description>
            {config.title} —{' '}
            {hasTabs
              ? 'Navigate between tabs to access different sections'
              : config.description || 'Dialog content'}
          </Dialog.Description>

          {/* MAIN ============================================================= */}

          <Dialog.Body className="dialog-main">
            {hasTabs ? (
              <Tabs.Root value={activeTab} onValueChange={({ value }) => handleTabChange(value)}>
                <Tabs.List>
                  {config.tabs.map((tab) => (
                    <Tabs.Trigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                      {tab.icon ? tab.icon : null} {tab.label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <div className="dialog-content">
                  {config.tabs.map((tab) => (
                    <Tabs.Content key={tab.id} value={tab.id}>
                      {tab.content}
                    </Tabs.Content>
                  ))}
                </div>
              </Tabs.Root>
            ) : (
              <div className="dialog-content" style={{ marginTop: '1.5rem' }}>
                {currentTab?.content}
              </div>
            )}
          </Dialog.Body>

          {/* FOOTER =========================================================== */}

          {config.footer && (
            <Dialog.Footer className="footer">
              <Flex justify="end" gap={4} width="100%">
                {config.footer.secondaryButton && (
                  <Button
                    variant={config.footer.secondaryButton.variant ?? 'outline'}
                    colorScheme={config.footer.secondaryButton.colorScheme ?? 'default'}
                    size="lg"
                    onClick={config.footer.secondaryButton.onClick}
                  >
                    {config.footer.secondaryButton.label}
                  </Button>
                )}
                {config.footer.primaryButton && (
                  <Button
                    variant={config.footer.primaryButton.variant ?? 'outline'}
                    colorScheme={config.footer.primaryButton.colorScheme ?? 'default'}
                    size="lg"
                    onClick={config.footer.primaryButton.onClick}
                  >
                    {config.footer.primaryButton.label}
                  </Button>
                )}
              </Flex>
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
