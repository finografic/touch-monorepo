import { Field } from '@ark-ui/react';
import React, { forwardRef } from 'react';

// ── InputField.Slot ───────────────────────────────────────────────────────────

export interface InputFieldSlotProps {
  side?: 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

export function InputFieldSlot({
  side = 'left',
  children,
  className,
  style,
  onClick,
  onKeyDown,
}: InputFieldSlotProps) {
  return (
    <div
      className={['ds-input-field__slot', `ds-input-field__slot--${side}`, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

InputFieldSlot.displayName = 'InputField.Slot';

// ── InputField.Root ───────────────────────────────────────────────────────────

export interface InputFieldRootProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Decoration slots — use InputField.Slot with side="left" | "right" */
  children?: React.ReactNode;
  className?: string;
  invalid?: boolean;
}

export const InputFieldRoot = forwardRef<HTMLInputElement, InputFieldRootProps>(
  ({ children, className, invalid, ...inputProps }, ref) => {
    const leftSlots: React.ReactNode[] = [];
    const rightSlots: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === InputFieldSlot) {
        if ((child.props as InputFieldSlotProps).side === 'right') {
          rightSlots.push(child);
        } else {
          leftSlots.push(child);
        }
      }
    });

    return (
      <div
        className={['ds-input-field', className].filter(Boolean).join(' ')}
        data-invalid={invalid || undefined}
      >
        {leftSlots}
        <Field.Input ref={ref} className="ds-input-field__input" {...inputProps} />
        {rightSlots}
      </div>
    );
  },
);

InputFieldRoot.displayName = 'InputField.Root';

// ── Compound export ───────────────────────────────────────────────────────────

export const InputField = {
  Root: InputFieldRoot,
  Slot: InputFieldSlot,
};
