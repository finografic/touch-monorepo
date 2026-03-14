import { Field } from '@ark-ui/react';
import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  isValidElement,
  type ReactNode,
} from 'react';

import { inputFieldRecipe } from './input-field.recipe';
import type { InputFieldVariants } from './input-field.types';

// ── InputField.Slot ───────────────────────────────────────────────────────────

export interface InputFieldSlotProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
  /** Makes the slot interactive (pointer-events: auto, cursor: pointer) */
  interactive?: boolean;
}

export function InputFieldSlot({
  side = 'left',
  interactive,
  className,
  children,
  ...props
}: InputFieldSlotProps) {
  return (
    <div
      data-side={side}
      data-interactive={interactive ? 'true' : undefined}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

InputFieldSlot.displayName = 'InputField.Slot';

// ── InputField.Root ───────────────────────────────────────────────────────────

export interface InputFieldRootProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputFieldVariants {
  /** Decoration slots — InputField.Slot with side="left" | "right" */
  children?: ReactNode;
  invalid?: boolean;
}

export const InputFieldRoot = forwardRef<HTMLInputElement, InputFieldRootProps>(
  ({ children, className, size = 'md', invalid, disabled, ...inputProps }, ref) => {
    const leadingSlots: ReactNode[] = [];
    const trailingSlots: ReactNode[] = [];

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === InputFieldSlot) {
        const side = (child.props as InputFieldSlotProps).side ?? 'left';
        if (side === 'right') trailingSlots.push(child);
        else leadingSlots.push(child);
      }
    });

    const cls = inputFieldRecipe({
      size,
      hasLeadingSlot: leadingSlots.length > 0,
      hasTrailingSlot: trailingSlots.length > 0,
    });

    return (
      <div
        className={[cls.root, className].filter(Boolean).join(' ')}
        data-invalid={invalid ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
      >
        {leadingSlots.map((slot, i) =>
          isValidElement(slot)
            ? (slot as any).type === InputFieldSlot
              ? // clone to inject recipe class

                {
                  ...(slot as any),
                  props: {
                    ...(slot as any).props,
                    className: [cls.slot, (slot as any).props.className].filter(Boolean).join(' '),
                  },
                  key: i,
                }
              : slot
            : slot,
        )}
        <Field.Input
          ref={ref}
          className={cls.input}
          disabled={disabled}
          aria-invalid={invalid}
          {...inputProps}
        />
        {trailingSlots.map((slot, i) =>
          isValidElement(slot)
            ? {
                ...(slot as any),
                props: {
                  ...(slot as any).props,
                  className: [cls.slot, (slot as any).props.className].filter(Boolean).join(' '),
                },
                key: i,
              }
            : slot,
        )}
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
