import { CheckIcon, MinusIcon } from '@workspace/icons';

import type { CheckboxRootProps } from '@ark-ui/react';
import { Checkbox as ArkCheckbox } from '@ark-ui/react';
import React from 'react';

// ── Checkbox.Root ─────────────────────────────────────────────────────────────

function Root({ className, children, ...props }: CheckboxRootProps) {
  return (
    <ArkCheckbox.Root className={['ds-checkbox', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </ArkCheckbox.Root>
  );
}

Root.displayName = 'Checkbox.Root';

// ── Checkbox.Control ──────────────────────────────────────────────────────────

function Control({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ArkCheckbox.Control className={['ds-checkbox__control', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </ArkCheckbox.Control>
  );
}

Control.displayName = 'Checkbox.Control';

// ── Checkbox.Indicator ────────────────────────────────────────────────────────
// Renders CheckIcon by default; MinusIcon for indeterminate state (via CSS).
// Pass children to override the icons entirely.

function Indicator({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ArkCheckbox.Indicator
      className={['ds-checkbox__indicator', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children ?? (
        <>
          <CheckIcon width={12} height={12} className="ds-checkbox__check-icon" />
          <MinusIcon width={12} height={12} className="ds-checkbox__minus-icon" />
        </>
      )}
    </ArkCheckbox.Indicator>
  );
}

Indicator.displayName = 'Checkbox.Indicator';

// ── Checkbox.Label ────────────────────────────────────────────────────────────

function Label({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <ArkCheckbox.Label className={['ds-checkbox__label', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </ArkCheckbox.Label>
  );
}

Label.displayName = 'Checkbox.Label';

// ── Checkbox.HiddenInput ──────────────────────────────────────────────────────

const HiddenInput = ArkCheckbox.HiddenInput;

// ── Compound export ───────────────────────────────────────────────────────────

export const Checkbox = {
  Root,
  Control,
  Indicator,
  Label,
  HiddenInput,
};
