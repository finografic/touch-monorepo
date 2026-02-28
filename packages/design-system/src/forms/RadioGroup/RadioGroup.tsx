import { RadioGroup as ArkRadioGroup } from '@ark-ui/react';
import type { RadioGroupRootProps } from '@ark-ui/react';
import React from 'react';

// ── RadioGroup.Root ───────────────────────────────────────────────────────────

export interface RadioGroupRootPropsDS
  extends Omit<RadioGroupRootProps, 'orientation'> {
  /**
   * Layout direction.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Visual variant:
   * - 'default' — traditional radio button (circle indicator + label)
   * - 'card'    — full-item tile, indicator optional (RadioCards equivalent)
   * @default 'default'
   */
  variant?: 'default' | 'card';
  className?: string;
  children?: React.ReactNode;
}

function Root({
  className,
  orientation = 'vertical',
  variant = 'default',
  children,
  ...props
}: RadioGroupRootPropsDS) {
  return (
    <ArkRadioGroup.Root
      className={['ds-radio-group', className].filter(Boolean).join(' ')}
      orientation={orientation}
      data-variant={variant}
      {...props}
    >
      {children}
    </ArkRadioGroup.Root>
  );
}

Root.displayName = 'RadioGroup.Root';

// ── RadioGroup.Item ───────────────────────────────────────────────────────────

function Item({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkRadioGroup.Item>) {
  return (
    <ArkRadioGroup.Item
      className={['ds-radio-group__item', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkRadioGroup.Item>
  );
}

Item.displayName = 'RadioGroup.Item';

// ── RadioGroup.ItemControl ────────────────────────────────────────────────────
// The radio circle. Omit from the JSX for card-variant items.

function ItemControl({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkRadioGroup.ItemControl>) {
  return (
    <ArkRadioGroup.ItemControl
      className={['ds-radio-group__item-control', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

ItemControl.displayName = 'RadioGroup.ItemControl';

// ── RadioGroup.Indicator ──────────────────────────────────────────────────────
// The dot inside the radio circle.

function Indicator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkRadioGroup.Indicator>) {
  return (
    <ArkRadioGroup.Indicator
      className={['ds-radio-group__indicator', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

Indicator.displayName = 'RadioGroup.Indicator';

// ── RadioGroup.ItemText ───────────────────────────────────────────────────────

function ItemText({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkRadioGroup.ItemText>) {
  return (
    <ArkRadioGroup.ItemText
      className={['ds-radio-group__item-text', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkRadioGroup.ItemText>
  );
}

ItemText.displayName = 'RadioGroup.ItemText';

// ── RadioGroup.Label ──────────────────────────────────────────────────────────

function Label({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkRadioGroup.Label>) {
  return (
    <ArkRadioGroup.Label
      className={['ds-radio-group__label', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkRadioGroup.Label>
  );
}

Label.displayName = 'RadioGroup.Label';

// ── Compound export ───────────────────────────────────────────────────────────

export const RadioGroup = {
  Root,
  Item,
  ItemControl,
  Indicator,
  ItemText,
  Label,
};
