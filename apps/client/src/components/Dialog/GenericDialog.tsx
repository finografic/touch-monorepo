import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ButtonProps } from '@finografic/design-system/components';
import { Button, Dialog, Tabs } from '@finografic/design-system/components';
import { CloseIcon } from '@finografic/icons';

import clsx from 'clsx';
import type { DialogConfig } from 'components/Dialog/GenericDialog.types';

import { cleanupDialogBodyAttributes } from 'utils/ui.utils';

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

  const footer = useMemo(() => {
    return config.footer
      ? {
        isRTL: config.footer.isRTL ?? true,
        isFilled: config.footer.isFilled ?? false,
        buttons: config.footer.buttons ?? [],
      }
      : null;
  }, [config?.footer]);

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

  // Run cleanup only when the dialog is actually closed (`isOpen` false). Do not use an empty-deps
  // unmount effect: React Strict Mode runs that cleanup on the dev double-mount and strips scroll-lock
  // while the dialog is opening.
  // Important: do not name this effect `cleanupDialogBodyAttributes` — it would shadow the import and
  // the timeouts would call the effect function instead of the util (runaway timers / slowdown).
  useEffect(function updateBodyAttributes() {
    if (!isOpen) {
      const id = window.setTimeout(() => cleanupDialogBodyAttributes(), 0);
      const idLater = window.setTimeout(() => cleanupDialogBodyAttributes(), 150);

      return () => {
        window.clearTimeout(id);
        window.clearTimeout(idLater);
      };
    }
  }, [isOpen]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          className={clsx('dialog-content', className, config.size && `dialog-size-${config.size}`)}
          css={styles}
          data-dialog-size={config.size ?? 'md'}
          style={dynamicStyles}
        >
          {/* HEADER =========================================================== */}

          <Dialog.Header className={clsx('dialog-header', { 'has-title': hasTitle })}>
            <Dialog.Title className={hasTitle ? undefined : 'sr-only'}>
              {config.title || 'Dialog'}
              {config.subtitle && <span className="subtitle">{config.subtitle}</span>}
            </Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button variant="ghost" size="sm" className="close-button" aria-label="Close dialog">
                <CloseIcon />
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>

          {/* Accessible description for screen readers */}

          {config.description && (
            <Dialog.Description>
              {config.title} — {hasTabs
                ? 'Navigate between tabs to access different sections'
                : config.description || ' '}
            </Dialog.Description>
          )}

          {/* MAIN ============================================================= */}

          <Dialog.Body className="dialog-main">
            {hasTabs
              ? (
                <Tabs.Root value={activeTab} onValueChange={({ value }) => handleTabChange(value)}>
                  <Tabs.List>
                    {config.tabs.map((tab) => (
                      <Tabs.Trigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                        {tab.icon ? tab.icon : null} {tab.label}
                      </Tabs.Trigger>
                    ))}
                    <Tabs.Indicator />
                  </Tabs.List>
                  <div className="dialog-content">
                    {config.tabs.map((tab) => (
                      <Tabs.Content key={tab.id} value={tab.id}>
                        {tab.content}
                      </Tabs.Content>
                    ))}
                  </div>
                </Tabs.Root>
              )
              : (
                <div
                  className="dialog-content"
                  style={{ marginTop: '2rem', marginBottom: '1.25rem' }}
                >
                  {currentTab?.content}
                </div>
              )}
          </Dialog.Body>

          {/* FOOTER =========================================================== */}

          {footer && (
            <Dialog.Footer className="footer">
              <div
                className={clsx(
                  'footer-buttons-wrapper',
                  footer.isRTL && 'footer-buttons-rtl',
                  footer.isFilled && 'footer-buttons-filled',
                )}
              >
                {(footer.isRTL ? footer.buttons : [...footer.buttons].reverse()).map(
                  (props: ButtonProps, i) => (
                    <Button key={i} size="md" palette="default" variant="solid" {...props} />
                  ),
                )}
              </div>
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
