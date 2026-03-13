import { Dialog as ArkDialog } from '@ark-ui/react';
import React from 'react';

import type { DialogContentPropsDS, DialogRootPropsDS } from './dialog.types';

function Root({ onOpenChange, children, ...props }: DialogRootPropsDS) {
  return (
    <ArkDialog.Root onOpenChange={({ open }) => onOpenChange?.(open)} {...props}>
      {children}
    </ArkDialog.Root>
  );
}

Root.displayName = 'Dialog.Root';

// ── Dialog.Backdrop ───────────────────────────────────────────────────────────

function Backdrop({ className, ...props }: React.ComponentPropsWithoutRef<typeof ArkDialog.Backdrop>) {
  return (
    <ArkDialog.Backdrop className={['ds-dialog__backdrop', className].filter(Boolean).join(' ')} {...props} />
  );
}

Backdrop.displayName = 'Dialog.Backdrop';

// ── Dialog.Positioner ─────────────────────────────────────────────────────────

function Positioner({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkDialog.Positioner>) {
  return (
    <ArkDialog.Positioner
      className={['ds-dialog__positioner', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkDialog.Positioner>
  );
}

Positioner.displayName = 'Dialog.Positioner';

// ── Dialog.Content ────────────────────────────────────────────────────────────

function Content({ className, size = 'md', children, ...props }: DialogContentPropsDS) {
  return (
    <ArkDialog.Content
      className={['ds-dialog__content', className].filter(Boolean).join(' ')}
      data-size={size}
      {...props}
    >
      {children}
    </ArkDialog.Content>
  );
}

Content.displayName = 'Dialog.Content';

// ── Dialog.Header ─────────────────────────────────────────────────────────────

function Header({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['ds-dialog__header', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

Header.displayName = 'Dialog.Header';

// ── Dialog.Title ──────────────────────────────────────────────────────────────

function Title({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof ArkDialog.Title>) {
  return (
    <ArkDialog.Title className={['ds-dialog__title', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </ArkDialog.Title>
  );
}

Title.displayName = 'Dialog.Title';

// ── Dialog.Description ────────────────────────────────────────────────────────

function Description({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkDialog.Description>) {
  return (
    <ArkDialog.Description
      className={['ds-dialog__description', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkDialog.Description>
  );
}

Description.displayName = 'Dialog.Description';

// ── Dialog.Body ───────────────────────────────────────────────────────────────

function Body({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['ds-dialog__body', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

Body.displayName = 'Dialog.Body';

// ── Dialog.Footer ─────────────────────────────────────────────────────────────

function Footer({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['ds-dialog__footer', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

Footer.displayName = 'Dialog.Footer';

// ── Dialog.CloseTrigger ───────────────────────────────────────────────────────

function CloseTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkDialog.CloseTrigger>) {
  return (
    <ArkDialog.CloseTrigger
      className={['ds-dialog__close-trigger', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkDialog.CloseTrigger>
  );
}

CloseTrigger.displayName = 'Dialog.CloseTrigger';

// ── Compound export ───────────────────────────────────────────────────────────

export const Dialog = {
  Root,
  Backdrop,
  Positioner,
  Content,
  Header,
  Title,
  Description,
  Body,
  Footer,
  CloseTrigger,
};
