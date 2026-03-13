import { Slider as ArkSlider } from '@ark-ui/react';
import type { SliderRootProps } from '@ark-ui/react';
import React from 'react';

// ── Slider.Root ───────────────────────────────────────────────────────────────

export interface SliderRootPropsDS
  extends Omit<SliderRootProps, 'value' | 'onValueChange' | 'defaultValue'> {
  /** Controlled value (single thumb) */
  value?: number;
  /** Change handler — receives the new numeric value */
  onValueChange?: (value: number) => void;
  /** Uncontrolled default value */
  defaultValue?: number;
  className?: string;
  children?: React.ReactNode;
}

function Root({
  value,
  onValueChange,
  defaultValue,
  className,
  children,
  ...props
}: SliderRootPropsDS) {
  return (
    <ArkSlider.Root
      className={['ds-slider', className].filter(Boolean).join(' ')}
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={({ value }) => onValueChange?.(value[0])}
      {...props}
    >
      {children}
    </ArkSlider.Root>
  );
}

Root.displayName = 'Slider.Root';

// ── Slider.Label ──────────────────────────────────────────────────────────────

function Label({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkSlider.Label>) {
  return (
    <ArkSlider.Label
      className={['ds-slider__label', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkSlider.Label>
  );
}

Label.displayName = 'Slider.Label';

// ── Slider.ValueText ──────────────────────────────────────────────────────────

function ValueText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkSlider.ValueText>) {
  return (
    <ArkSlider.ValueText
      className={['ds-slider__value-text', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

ValueText.displayName = 'Slider.ValueText';

// ── Slider.Control ────────────────────────────────────────────────────────────

function Control({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkSlider.Control>) {
  return (
    <ArkSlider.Control
      className={['ds-slider__control', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkSlider.Control>
  );
}

Control.displayName = 'Slider.Control';

// ── Slider.Track ──────────────────────────────────────────────────────────────

function Track({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkSlider.Track>) {
  return (
    <ArkSlider.Track
      className={['ds-slider__track', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </ArkSlider.Track>
  );
}

Track.displayName = 'Slider.Track';

// ── Slider.Range ──────────────────────────────────────────────────────────────

function Range({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkSlider.Range>) {
  return (
    <ArkSlider.Range
      className={['ds-slider__range', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

Range.displayName = 'Slider.Range';

// ── Slider.Thumb ──────────────────────────────────────────────────────────────

function Thumb({
  className,
  index = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof ArkSlider.Thumb> & { index?: number }) {
  return (
    <ArkSlider.Thumb
      index={index}
      className={['ds-slider__thumb', className].filter(Boolean).join(' ')}
      {...props}
    >
      <ArkSlider.HiddenInput />
    </ArkSlider.Thumb>
  );
}

Thumb.displayName = 'Slider.Thumb';

// ── Compound export ───────────────────────────────────────────────────────────

export const Slider = {
  Root,
  Label,
  ValueText,
  Control,
  Track,
  Range,
  Thumb,
};
