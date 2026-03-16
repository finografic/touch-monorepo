# Dialog

https://ark-ui.com/docs/components/dialog

## Anatomy

```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.CloseTrigger />
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>;
```

## Examples

**Example: basic**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const Basic = () => (
  <Dialog.Root>
    <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Positioner className={styles.Positioner}>
        <Dialog.Content className={styles.Content}>
          <Dialog.CloseTrigger className={styles.CloseTrigger}>
            <XIcon />
          </Dialog.CloseTrigger>
          <Dialog.Title className={styles.Title}>Welcome Back</Dialog.Title>
          <Dialog.Description className={styles.Description}>Sign in to your account to continue.</Dialog.Description>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
```

### Controlled

Manage the dialog state using the `open` and `onOpenChange` props.

**Example: controlled**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Positioner className={styles.Positioner}>
          <Dialog.Content className={styles.Content}>
            <Dialog.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </Dialog.CloseTrigger>
            <Dialog.Title className={styles.Title}>Session Settings</Dialog.Title>
            <Dialog.Description className={styles.Description}>
              Manage your session preferences and security options.
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
```

### Root Provider

An alternative way to control the dialog is to use the `RootProvider` component and the `useDialog` hook. This way you
can access the state and methods from outside the component.

**Example: root-provider**

#### React

```tsx
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const RootProvider = () => {
  const dialog = useDialog();

  return (
    <div className="stack">
      <button className={button.Root} onClick={() => dialog.setOpen(true)}>
        Dialog is {dialog.open ? 'open' : 'closed'}
      </button>
      <Dialog.RootProvider value={dialog}>
        <Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Positioner className={styles.Positioner}>
            <Dialog.Content className={styles.Content}>
              <Dialog.CloseTrigger className={styles.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
              <Dialog.Title className={styles.Title}>Controlled Externally</Dialog.Title>
              <Dialog.Description className={styles.Description}>
                This dialog is controlled via the useDialog hook.
              </Dialog.Description>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    </div>
  );
};
```

### Alert Dialog

For critical confirmations or destructive actions, use `role="alertdialog"`. Alert dialogs differ from regular dialogs
in important ways:

- **Automatic focus**: The close/cancel button receives focus when opened, prioritizing the safest action
- **Requires explicit dismissal**: Cannot be closed by clicking outside, only via button clicks or Escape key

**Example: alert-dialog**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const AlertDialog = () => (
  <Dialog.Root role="alertdialog">
    <Dialog.Trigger className={button.Root}>Delete Account</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Positioner className={styles.Positioner}>
        <Dialog.Content className={styles.Content}>
          <Dialog.Title className={styles.Title}>Are you absolutely sure?</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </Dialog.Description>
          <div className={styles.Actions}>
            <Dialog.CloseTrigger className={button.Root}>Cancel</Dialog.CloseTrigger>
            <button className={button.Root} data-variant="solid">
              Delete Account
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
```

### Lazy Mount

Use `lazyMount` to render dialog content only when first opened. Combine with `unmountOnExit` to unmount when closed,
freeing up resources.

**Example: lazy-mount**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const LazyMount = () => (
  <Dialog.Root lazyMount unmountOnExit>
    <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Positioner className={styles.Positioner}>
        <Dialog.Content className={styles.Content}>
          <Dialog.CloseTrigger className={styles.CloseTrigger}>
            <XIcon />
          </Dialog.CloseTrigger>
          <Dialog.Title className={styles.Title}>Lazy Loaded</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            This dialog content is only mounted when opened and unmounts on close.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
```

### Initial Focus

Use `initialFocusEl` to control which element receives focus when the dialog opens.

**Example: initial-focus**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import { useRef } from 'react';
import button from 'styles/button.module.css';
import field from 'styles/field.module.css';
import styles from 'styles/dialog.module.css';

export const InitialFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root initialFocusEl={() => inputRef.current}>
      <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Positioner className={styles.Positioner}>
          <Dialog.Content className={styles.Content}>
            <Dialog.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </Dialog.CloseTrigger>
            <Dialog.Title className={styles.Title}>Edit Profile</Dialog.Title>
            <Dialog.Description className={styles.Description}>
              The first input will be focused when the dialog opens.
            </Dialog.Description>
            <div className={styles.Body}>
              <input ref={inputRef} className={field.Input} placeholder="Enter your name..." />
              <input className={field.Input} placeholder="Enter your email..." />
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
```

### Final Focus

Use `finalFocusEl` to control which element receives focus when the dialog closes. Defaults to the trigger element.

**Example: final-focus**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import { useRef } from 'react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const FinalFocus = () => {
  const finalRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="stack">
      <button className={button.Root} ref={finalRef}>
        I will receive focus when dialog closes
      </button>
      <Dialog.Root finalFocusEl={() => finalRef.current}>
        <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Positioner className={styles.Positioner}>
            <Dialog.Content className={styles.Content}>
              <Dialog.CloseTrigger className={styles.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
              <Dialog.Title className={styles.Title}>Focus Redirect</Dialog.Title>
              <Dialog.Description className={styles.Description}>
                When this dialog closes, focus will return to the button above instead of the trigger.
              </Dialog.Description>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  );
};
```

### Non-Modal

Use `modal={false}` to allow interaction with elements outside the dialog. Disables focus trapping and scroll
prevention.

**Example: non-modal**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const NonModal = () => (
  <Dialog.Root modal={false}>
    <Dialog.Trigger className={button.Root}>Open Non-Modal Dialog</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Positioner className={styles.Positioner}>
        <Dialog.Content className={styles.Content}>
          <Dialog.CloseTrigger className={styles.CloseTrigger}>
            <XIcon />
          </Dialog.CloseTrigger>
          <Dialog.Title className={styles.Title}>Non-Modal Dialog</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            This dialog allows interaction with elements outside. You can click buttons, select text, and interact with
            the page behind it.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
```

### Inside Scroll

Make the content area scrollable while keeping header and footer fixed using `maxHeight` and `overflow: auto`.

**Example: inside-scroll**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const InsideScroll = () => (
  <Dialog.Root>
    <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Positioner className={styles.Positioner}>
        <Dialog.Content className={styles.Content} style={{ maxHeight: 'min(32rem, calc(100vh - 4rem))' }}>
          <Dialog.CloseTrigger className={styles.CloseTrigger}>
            <XIcon />
          </Dialog.CloseTrigger>
          <Dialog.Title className={styles.Title}>Terms of Service</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            Please review our terms before continuing.
          </Dialog.Description>
          <div className={styles.ScrollContainer}>
            {CONTENT_SECTIONS.map((item) => (
              <section key={item.title} className={styles.ScrollSection}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </section>
            ))}
          </div>
          <div className={styles.Actions}>
            <Dialog.CloseTrigger className={button.Root}>Decline</Dialog.CloseTrigger>
            <Dialog.CloseTrigger className={button.Root} data-variant="solid">
              Accept
            </Dialog.CloseTrigger>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);

const CONTENT_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By accessing and using this service, you accept and agree to be bound by the terms and provisions of this agreement.',
  },
  {
    title: '2. Use License',
    body:
      'Permission is granted to temporarily use this service for personal, non-commercial purposes only. This is the grant of a license, not a transfer of title.',
  },
  {
    title: '3. User Responsibilities',
    body:
      'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.',
  },
  {
    title: '4. Privacy Policy',
    body:
      'Your use of this service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.',
  },
  {
    title: '5. Limitations',
    body:
      'In no event shall we be liable for any damages arising out of the use or inability to use the materials on this service.',
  },
  {
    title: '6. Revisions',
    body:
      'We may revise these terms of service at any time without notice. By using this service you are agreeing to be bound by the then current version of these terms.',
  },
  {
    title: '7. Governing Law',
    body:
      'These terms and conditions are governed by and construed in accordance with applicable laws and you irrevocably submit to the exclusive jurisdiction of the courts.',
  },
];
```

### Outside Scroll

Make the positioner scrollable so the dialog can extend beyond the viewport.

**Example: outside-scroll**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import { useRef } from 'react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const OutsideScroll = () => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <Dialog.Root initialFocusEl={() => contentRef.current}>
      <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Positioner className={styles.OutsideScrollPositioner}>
          <Dialog.Content
            ref={contentRef}
            className={styles.Content}
            style={{ margin: '4rem auto', maxHeight: 'none' }}
          >
            <Dialog.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </Dialog.CloseTrigger>
            <Dialog.Title className={styles.Title}>Privacy Policy</Dialog.Title>
            <Dialog.Description className={styles.Description}>
              This layout allows the dialog to extend beyond the viewport while keeping the outer container scrollable.
            </Dialog.Description>
            <div className={styles.Body}>
              {CONTENT_SECTIONS.map((item) => (
                <section key={item.title} className={styles.ScrollSection}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const CONTENT_SECTIONS = [
  {
    title: '1. Information We Collect',
    body:
      'We collect information you provide directly, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, and payment information.',
  },
  {
    title: '2. How We Use Your Information',
    body:
      'We use the information we collect to provide and improve our services, process transactions, send communications, and personalize your experience.',
  },
  {
    title: '3. Information Sharing',
    body:
      'We do not sell your personal information. We may share information with service providers who assist in our operations, or when required by law.',
  },
  {
    title: '4. Data Security',
    body:
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.',
  },
  {
    title: '5. Your Rights',
    body:
      'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.',
  },
  {
    title: '6. Cookies and Tracking',
    body:
      'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver targeted content. You can manage cookie preferences in your browser settings.',
  },
  {
    title: '7. Third-Party Services',
    body:
      'Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.',
  },
  {
    title: '8. Children Privacy',
    body:
      'Our services are not directed to children under 13. We do not knowingly collect personal information from children without parental consent.',
  },
  {
    title: '9. International Transfers',
    body:
      'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.',
  },
  {
    title: '10. Changes to This Policy',
    body:
      'We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.',
  },
  {
    title: '11. Data Retention',
    body:
      'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.',
  },
  {
    title: '12. Contact Us',
    body:
      'If you have questions about this privacy policy or our data practices, please contact our privacy team through the support channels provided on our website.',
  },
];
```

### Context

Access the dialog's state and methods with `Dialog.Context` or the `useDialogContext` hook.

**Example: context**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const Context = () => (
  <Dialog.Root>
    <Dialog.Trigger className={button.Root}>Open Dialog</Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Positioner className={styles.Positioner}>
        <Dialog.Content className={styles.Content}>
          <Dialog.CloseTrigger className={styles.CloseTrigger}>
            <XIcon />
          </Dialog.CloseTrigger>
          <Dialog.Title className={styles.Title}>Status</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            <Dialog.Context>{(dialog) => <span>Dialog is {dialog.open ? 'open' : 'closed'}</span>}</Dialog.Context>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
```

### Open from Menu

Open a dialog imperatively from a menu item using the `onClick` handler.

**Example: open-from-menu**

#### React

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Menu } from '@ark-ui/react/menu';
import { Portal } from '@ark-ui/react/portal';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import dialog from 'styles/dialog.module.css';
import menu from 'styles/menu.module.css';

export const OpenFromMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Menu.Root>
        <Menu.Trigger className={menu.Trigger}>
          Actions
          <Menu.Indicator className={menu.Indicator}>
            <ChevronDownIcon />
          </Menu.Indicator>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content className={menu.Content}>
              <Menu.Item className={menu.Item} value="edit">
                Edit
              </Menu.Item>
              <Menu.Item className={menu.Item} value="duplicate">
                Duplicate
              </Menu.Item>
              <Menu.Separator className={menu.Separator} />
              <Menu.Item className={menu.Item} value="delete" onClick={() => setOpen(true)}>
                Delete...
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} role="alertdialog">
        <Portal>
          <Dialog.Backdrop className={dialog.Backdrop} />
          <Dialog.Positioner className={dialog.Positioner}>
            <Dialog.Content className={dialog.Content}>
              <Dialog.Title className={dialog.Title}>Confirm Delete</Dialog.Title>
              <Dialog.Description className={dialog.Description}>
                Are you sure you want to delete this item? This action cannot be undone.
              </Dialog.Description>
              <Dialog.CloseTrigger className={dialog.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
```

### Nested

Nest dialogs within one another. The parent receives `data-has-nested` and `--nested-layer-count` CSS variable for
styling effects like zoom-out:

```css
[data-part="content"][data-has-nested] {
  transform: scale(calc(1 - var(--nested-layer-count) * 0.05));
}
```

**Example: nested**

#### React

```tsx
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import button from 'styles/button.module.css';
import styles from 'styles/dialog.module.css';

export const Nested = () => {
  const parentDialog = useDialog();
  const childDialog = useDialog();

  return (
    <>
      <button className={button.Root} onClick={() => parentDialog.setOpen(true)}>
        Open Parent Dialog
      </button>

      <Dialog.RootProvider value={parentDialog}>
        <Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Positioner className={styles.Positioner}>
            <Dialog.Content className={styles.Content}>
              <Dialog.CloseTrigger className={styles.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
              <Dialog.Title className={styles.Title}>Parent Dialog</Dialog.Title>
              <Dialog.Description className={styles.Description}>
                This is the parent dialog. Open a nested dialog to see automatic z-index management.
              </Dialog.Description>
              <div className={styles.Body}>
                <button className={button.Root} onClick={() => childDialog.setOpen(true)}>
                  Open Nested Dialog
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>

      <Dialog.RootProvider value={childDialog}>
        <Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Positioner className={styles.Positioner}>
            <Dialog.Content className={styles.Content}>
              <Dialog.CloseTrigger className={styles.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
              <Dialog.Title className={styles.Title}>Nested Dialog</Dialog.Title>
              <Dialog.Description className={styles.Description}>
                This dialog is nested within the parent with proper z-index layering.
              </Dialog.Description>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    </>
  );
};
```

### Confirmation

Intercept close attempts to show confirmation prompts, preventing data loss from unsaved changes.

**Example: confirmation**

#### React

```tsx
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import button from 'styles/button.module.css';
import field from 'styles/field.module.css';
import styles from 'styles/dialog.module.css';

export const Confirmation = () => {
  const [formContent, setFormContent] = useState('');
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);

  const parentDialog = useDialog({
    open: isParentDialogOpen,
    onOpenChange: (details) => {
      if (!details.open && formContent.trim()) {
        confirmDialog.setOpen(true);
      } else {
        setIsParentDialogOpen(details.open);
      }
    },
  });

  const confirmDialog = useDialog();

  const handleConfirmClose = () => {
    confirmDialog.setOpen(false);
    parentDialog.setOpen(false);
    setFormContent('');
  };

  return (
    <>
      <button className={button.Root} onClick={() => parentDialog.setOpen(true)}>
        Open Form
      </button>

      <Dialog.RootProvider value={parentDialog}>
        <Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Positioner className={styles.Positioner}>
            <Dialog.Content className={styles.Content}>
              <Dialog.CloseTrigger className={styles.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
              <Dialog.Title className={styles.Title}>Edit Content</Dialog.Title>
              <Dialog.Description className={styles.Description}>
                Make changes to your content. You'll be asked to confirm before closing if there are unsaved changes.
              </Dialog.Description>
              <div className={styles.Body}>
                <textarea
                  className={field.Textarea}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Enter some text..."
                  rows={4}
                />
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>

      <Dialog.RootProvider value={confirmDialog}>
        <Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Positioner className={styles.Positioner}>
            <Dialog.Content className={styles.Content}>
              <Dialog.CloseTrigger className={styles.CloseTrigger}>
                <XIcon />
              </Dialog.CloseTrigger>
              <Dialog.Title className={styles.Title}>Unsaved Changes</Dialog.Title>
              <Dialog.Description className={styles.Description}>
                You have unsaved changes. Are you sure you want to close without saving?
              </Dialog.Description>
              <div className={styles.Actions}>
                <button className={button.Root} onClick={() => confirmDialog.setOpen(false)}>
                  Keep Editing
                </button>
                <button className={button.Root} data-variant="solid" onClick={handleConfirmClose}>
                  Discard Changes
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    </>
  );
};
```

---

## Guides

### Close Behavior

- `closeOnEscape={false}` - Prevent closing on <kbd>Escape</kbd>
- `closeOnInteractOutside={false}` - Prevent closing on outside click

For conditional control, use `onEscapeKeyDown` or `onInteractOutside` with `e.preventDefault()`.

### Z-Index Stacking

Use the `--layer-index` CSS variable for z-index management of stacked dialogs:

```css
[data-part="content"] {
  z-index: calc(var(--layer-index));
}
```

### Dynamic Imports

When using `lazyMount` with `React.lazy` or Next.js `dynamic`, wrap the imported component in `Suspense`:

```tsx
import { Dialog } from '@ark-ui/react/dialog';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'));

export const Demo = () => (
  <Dialog.Root lazyMount>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Content>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </Dialog.Content>
  </Dialog.Root>
);
```

## API Reference

### Props

**Component API Reference**

#### React

**Root Props:**

| Prop                                                             | Type                                       | Required                                                       | Description                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `aria-label`                                                     | `string`                                   | No                                                             | Human readable label for the dialog, in event the dialog title is not rendered           |
| `closeOnEscape`                                                  | `boolean`                                  | No                                                             | Whether to close the dialog when the escape key is pressed                               |
| `closeOnInteractOutside`                                         | `boolean`                                  | No                                                             | Whether to close the dialog when the outside is clicked                                  |
| `defaultOpen`                                                    | `boolean`                                  | No                                                             | The initial open state of the dialog when rendered.                                      |
| Use when you don't need to control the open state of the dialog. |                                            |                                                                |                                                                                          |
| `finalFocusEl`                                                   | `() => MaybeElement`                       | No                                                             | Element to receive focus when the dialog is closed                                       |
| `id`                                                             | `string`                                   | No                                                             | The unique identifier of the machine.                                                    |
| `ids`                                                            | `Partial<{                                 |                                                                |                                                                                          |
| trigger: string                                                  |                                            |                                                                |                                                                                          |
| positioner: string                                               |                                            |                                                                |                                                                                          |
| backdrop: string                                                 |                                            |                                                                |                                                                                          |
| content: string                                                  |                                            |                                                                |                                                                                          |
| closeTrigger: string                                             |                                            |                                                                |                                                                                          |
| title: string                                                    |                                            |                                                                |                                                                                          |
| description: string                                              |                                            |                                                                |                                                                                          |
| }>`                                                              | No                                         | The ids of the elements in the dialog. Useful for composition. |                                                                                          |
| `immediate`                                                      | `boolean`                                  | No                                                             | Whether to synchronize the present change immediately or defer it to the next frame      |
| `initialFocusEl`                                                 | `() => MaybeElement`                       | No                                                             | Element to receive focus when the dialog is opened                                       |
| `lazyMount`                                                      | `boolean`                                  | No                                                             | Whether to enable lazy mounting                                                          |
| `modal`                                                          | `boolean`                                  | No                                                             | Whether to prevent pointer interaction outside the element and hide all content below it |
| `onEscapeKeyDown`                                                | `(event: KeyboardEvent) => void`           | No                                                             | Function called when the escape key is pressed                                           |
| `onExitComplete`                                                 | `VoidFunction`                             | No                                                             | Function called when the animation ends in the closed state                              |
| `onFocusOutside`                                                 | `(event: FocusOutsideEvent) => void`       | No                                                             | Function called when the focus is moved outside the component                            |
| `onInteractOutside`                                              | `(event: InteractOutsideEvent) => void`    | No                                                             | Function called when an interaction happens outside the component                        |
| `onOpenChange`                                                   | `(details: OpenChangeDetails) => void`     | No                                                             | Function to call when the dialog's open state changes                                    |
| `onPointerDownOutside`                                           | `(event: PointerDownOutsideEvent) => void` | No                                                             | Function called when the pointer is pressed down outside the component                   |
| `onRequestDismiss`                                               | `(event: LayerDismissEvent) => void`       | No                                                             | Function called when this layer is closed due to a parent layer being closed             |
| `open`                                                           | `boolean`                                  | No                                                             | The controlled open state of the dialog                                                  |
| `persistentElements`                                             | `(() => Element                            | null)[]`                                                       | No                                                                                       |

- should not have pointer-events disabled
- should not trigger the dismiss event |
  | `present` | `boolean` | No | Whether the node is present (controlled by the user) |
  | `preventScroll` | `boolean` | No | Whether to prevent scrolling behind the dialog when it's opened |
  | `restoreFocus` | `boolean` | No | Whether to restore focus to the element that had focus before the dialog was opened |
  | `role` | `'dialog' | 'alertdialog'` | No | The dialog's role |
  | `skipAnimationOnMount` | `boolean` | No | Whether to allow the initial presence animation. |
  | `trapFocus` | `boolean` | No | Whether to trap focus inside the dialog when it's opened |
  | `unmountOnExit` | `boolean` | No | Whether to unmount on exit. |

**Backdrop Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Backdrop Data Attributes:**

| Attribute      | Value    |
| -------------- | -------- |
| `[data-scope]` | dialog   |
| `[data-part]`  | backdrop |
| `[data-state]` | "open"   |

**Backdrop CSS Variables:**

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `--layer-index` | The index of the dismissable in the layer stack |

**CloseTrigger Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Content Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Content Data Attributes:**

| Attribute           | Value   |
| ------------------- | ------- |
| `[data-scope]`      | dialog  |
| `[data-part]`       | content |
| `[data-state]`      | "open"  |
| `[data-nested]`     | dialog  |
| `[data-has-nested]` | dialog  |

**Content CSS Variables:**

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `--layer-index`        | The index of the dismissable in the layer stack |
| `--nested-layer-count` | The number of nested dialogs                    |

**Description Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Positioner Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**RootProvider Props:**

| Prop                   | Type              | Required | Description                                                                                         |
| ---------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `value`                | `UseDialogReturn` | Yes      |                                                                                                     |
| `asChild`              | `boolean`         | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `immediate`            | `boolean`         | No       | Whether to synchronize the present change immediately or defer it to the next frame                 |
| `lazyMount`            | `boolean`         | No       | Whether to enable lazy mounting                                                                     |
| `onExitComplete`       | `VoidFunction`    | No       | Function called when the animation ends in the closed state                                         |
| `present`              | `boolean`         | No       | Whether the node is present (controlled by the user)                                                |
| `skipAnimationOnMount` | `boolean`         | No       | Whether to allow the initial presence animation.                                                    |
| `unmountOnExit`        | `boolean`         | No       | Whether to unmount on exit.                                                                         |

**Title Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Trigger Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Trigger Data Attributes:**

| Attribute      | Value   |
| -------------- | ------- |
| `[data-scope]` | dialog  |
| `[data-part]`  | trigger |
| `[data-state]` | "open"  |

#### Solid

**Root Props:**

| Prop                                                             | Type                                       | Required                                                       | Description                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `aria-label`                                                     | `string`                                   | No                                                             | Human readable label for the dialog, in event the dialog title is not rendered           |
| `closeOnEscape`                                                  | `boolean`                                  | No                                                             | Whether to close the dialog when the escape key is pressed                               |
| `closeOnInteractOutside`                                         | `boolean`                                  | No                                                             | Whether to close the dialog when the outside is clicked                                  |
| `defaultOpen`                                                    | `boolean`                                  | No                                                             | The initial open state of the dialog when rendered.                                      |
| Use when you don't need to control the open state of the dialog. |                                            |                                                                |                                                                                          |
| `finalFocusEl`                                                   | `() => MaybeElement`                       | No                                                             | Element to receive focus when the dialog is closed                                       |
| `id`                                                             | `string`                                   | No                                                             | The unique identifier of the machine.                                                    |
| `ids`                                                            | `Partial<{                                 |                                                                |                                                                                          |
| trigger: string                                                  |                                            |                                                                |                                                                                          |
| positioner: string                                               |                                            |                                                                |                                                                                          |
| backdrop: string                                                 |                                            |                                                                |                                                                                          |
| content: string                                                  |                                            |                                                                |                                                                                          |
| closeTrigger: string                                             |                                            |                                                                |                                                                                          |
| title: string                                                    |                                            |                                                                |                                                                                          |
| description: string                                              |                                            |                                                                |                                                                                          |
| }>`                                                              | No                                         | The ids of the elements in the dialog. Useful for composition. |                                                                                          |
| `immediate`                                                      | `boolean`                                  | No                                                             | Whether to synchronize the present change immediately or defer it to the next frame      |
| `initialFocusEl`                                                 | `() => MaybeElement`                       | No                                                             | Element to receive focus when the dialog is opened                                       |
| `lazyMount`                                                      | `boolean`                                  | No                                                             | Whether to enable lazy mounting                                                          |
| `modal`                                                          | `boolean`                                  | No                                                             | Whether to prevent pointer interaction outside the element and hide all content below it |
| `onEscapeKeyDown`                                                | `(event: KeyboardEvent) => void`           | No                                                             | Function called when the escape key is pressed                                           |
| `onExitComplete`                                                 | `VoidFunction`                             | No                                                             | Function called when the animation ends in the closed state                              |
| `onFocusOutside`                                                 | `(event: FocusOutsideEvent) => void`       | No                                                             | Function called when the focus is moved outside the component                            |
| `onInteractOutside`                                              | `(event: InteractOutsideEvent) => void`    | No                                                             | Function called when an interaction happens outside the component                        |
| `onOpenChange`                                                   | `(details: OpenChangeDetails) => void`     | No                                                             | Function to call when the dialog's open state changes                                    |
| `onPointerDownOutside`                                           | `(event: PointerDownOutsideEvent) => void` | No                                                             | Function called when the pointer is pressed down outside the component                   |
| `onRequestDismiss`                                               | `(event: LayerDismissEvent) => void`       | No                                                             | Function called when this layer is closed due to a parent layer being closed             |
| `open`                                                           | `boolean`                                  | No                                                             | The controlled open state of the dialog                                                  |
| `persistentElements`                                             | `(() => Element                            | null)[]`                                                       | No                                                                                       |

- should not have pointer-events disabled
- should not trigger the dismiss event |
  | `present` | `boolean` | No | Whether the node is present (controlled by the user) |
  | `preventScroll` | `boolean` | No | Whether to prevent scrolling behind the dialog when it's opened |
  | `restoreFocus` | `boolean` | No | Whether to restore focus to the element that had focus before the dialog was opened |
  | `role` | `'dialog' | 'alertdialog'` | No | The dialog's role |
  | `skipAnimationOnMount` | `boolean` | No | Whether to allow the initial presence animation. |
  | `trapFocus` | `boolean` | No | Whether to trap focus inside the dialog when it's opened |
  | `unmountOnExit` | `boolean` | No | Whether to unmount on exit. |

**Backdrop Props:**

| Prop      | Type                                     | Required | Description                                                                                         |
| --------- | ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'div'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Backdrop Data Attributes:**

| Attribute      | Value    |
| -------------- | -------- |
| `[data-scope]` | dialog   |
| `[data-part]`  | backdrop |
| `[data-state]` | "open"   |

**Backdrop CSS Variables:**

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `--layer-index` | The index of the dismissable in the layer stack |

**CloseTrigger Props:**

| Prop      | Type                                        | Required | Description                                                                                         |
| --------- | ------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'button'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Content Props:**

| Prop      | Type                                     | Required | Description                                                                                         |
| --------- | ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'div'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Content Data Attributes:**

| Attribute           | Value   |
| ------------------- | ------- |
| `[data-scope]`      | dialog  |
| `[data-part]`       | content |
| `[data-state]`      | "open"  |
| `[data-nested]`     | dialog  |
| `[data-has-nested]` | dialog  |

**Content CSS Variables:**

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `--layer-index`        | The index of the dismissable in the layer stack |
| `--nested-layer-count` | The number of nested dialogs                    |

**Description Props:**

| Prop      | Type                                     | Required | Description                                                                                         |
| --------- | ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'div'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Positioner Props:**

| Prop      | Type                                     | Required | Description                                                                                         |
| --------- | ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'div'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**RootProvider Props:**

| Prop                   | Type              | Required | Description                                                                         |
| ---------------------- | ----------------- | -------- | ----------------------------------------------------------------------------------- |
| `value`                | `UseDialogReturn` | Yes      |                                                                                     |
| `immediate`            | `boolean`         | No       | Whether to synchronize the present change immediately or defer it to the next frame |
| `lazyMount`            | `boolean`         | No       | Whether to enable lazy mounting                                                     |
| `onExitComplete`       | `VoidFunction`    | No       | Function called when the animation ends in the closed state                         |
| `present`              | `boolean`         | No       | Whether the node is present (controlled by the user)                                |
| `skipAnimationOnMount` | `boolean`         | No       | Whether to allow the initial presence animation.                                    |
| `unmountOnExit`        | `boolean`         | No       | Whether to unmount on exit.                                                         |

**Title Props:**

| Prop      | Type                                    | Required | Description                                                                                         |
| --------- | --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'h2'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Trigger Props:**

| Prop      | Type                                        | Required | Description                                                                                         |
| --------- | ------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `(props: ParentProps<'button'>) => Element` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Trigger Data Attributes:**

| Attribute      | Value   |
| -------------- | ------- |
| `[data-scope]` | dialog  |
| `[data-part]`  | trigger |
| `[data-state]` | "open"  |

#### Vue

**Root Props:**

| Prop                                                             | Type               | Required                                                       | Description                                                                              |
| ---------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `aria-label`                                                     | `string`           | No                                                             | Human readable label for the dialog, in event the dialog title is not rendered           |
| `closeOnEscape`                                                  | `boolean`          | No                                                             | Whether to close the dialog when the escape key is pressed                               |
| `closeOnInteractOutside`                                         | `boolean`          | No                                                             | Whether to close the dialog when the outside is clicked                                  |
| `defaultOpen`                                                    | `boolean`          | No                                                             | The initial open state of the dialog when rendered.                                      |
| Use when you don't need to control the open state of the dialog. |                    |                                                                |                                                                                          |
| `finalFocusEl`                                                   | `() => HTMLElement | null`                                                          | No                                                                                       |
| `id`                                                             | `string`           | No                                                             | The unique identifier of the machine.                                                    |
| `ids`                                                            | `Partial<{         |                                                                |                                                                                          |
| trigger: string                                                  |                    |                                                                |                                                                                          |
| positioner: string                                               |                    |                                                                |                                                                                          |
| backdrop: string                                                 |                    |                                                                |                                                                                          |
| content: string                                                  |                    |                                                                |                                                                                          |
| closeTrigger: string                                             |                    |                                                                |                                                                                          |
| title: string                                                    |                    |                                                                |                                                                                          |
| description: string                                              |                    |                                                                |                                                                                          |
| }>`                                                              | No                 | The ids of the elements in the dialog. Useful for composition. |                                                                                          |
| `initialFocusEl`                                                 | `() => HTMLElement | null`                                                          | No                                                                                       |
| `lazyMount`                                                      | `boolean`          | No                                                             | Whether to enable lazy mounting                                                          |
| `modal`                                                          | `boolean`          | No                                                             | Whether to prevent pointer interaction outside the element and hide all content below it |
| `open`                                                           | `boolean`          | No                                                             | The controlled open state of the dialog                                                  |
| `persistentElements`                                             | `(() => Element    | null)[]`                                                       | No                                                                                       |

- should not have pointer-events disabled
- should not trigger the dismiss event |
  | `preventScroll` | `boolean` | No | Whether to prevent scrolling behind the dialog when it's opened |
  | `restoreFocus` | `boolean` | No | Whether to restore focus to the element that had focus before the dialog was opened |
  | `role` | `'dialog' | 'alertdialog'` | No | The dialog's role |
  | `trapFocus` | `boolean` | No | Whether to trap focus inside the dialog when it's opened |
  | `unmountOnExit` | `boolean` | No | Whether to unmount on exit. |

**Backdrop Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Backdrop Data Attributes:**

| Attribute      | Value    |
| -------------- | -------- |
| `[data-scope]` | dialog   |
| `[data-part]`  | backdrop |
| `[data-state]` | "open"   |

**Backdrop CSS Variables:**

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `--layer-index` | The index of the dismissable in the layer stack |

**CloseTrigger Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Content Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Content Data Attributes:**

| Attribute           | Value   |
| ------------------- | ------- |
| `[data-scope]`      | dialog  |
| `[data-part]`       | content |
| `[data-state]`      | "open"  |
| `[data-nested]`     | dialog  |
| `[data-has-nested]` | dialog  |

**Content CSS Variables:**

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `--layer-index`        | The index of the dismissable in the layer stack |
| `--nested-layer-count` | The number of nested dialogs                    |

**Description Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Positioner Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**RootProvider Props:**

| Prop            | Type                   | Required | Description                     |
| --------------- | ---------------------- | -------- | ------------------------------- |
| `value`         | `DialogApi<PropTypes>` | Yes      |                                 |
| `lazyMount`     | `boolean`              | No       | Whether to enable lazy mounting |
| `unmountOnExit` | `boolean`              | No       | Whether to unmount on exit.     |

**Title Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Trigger Props:**

| Prop      | Type      | Required | Description                                                                                         |
| --------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |

**Trigger Data Attributes:**

| Attribute      | Value   |
| -------------- | ------- |
| `[data-scope]` | dialog  |
| `[data-part]`  | trigger |
| `[data-state]` | "open"  |

#### Svelte

**Root Props:**

| Prop                                                             | Type                                       | Required                                                       | Description                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `aria-label`                                                     | `string`                                   | No                                                             | Human readable label for the dialog, in event the dialog title is not rendered           |
| `closeOnEscape`                                                  | `boolean`                                  | No                                                             | Whether to close the dialog when the escape key is pressed                               |
| `closeOnInteractOutside`                                         | `boolean`                                  | No                                                             | Whether to close the dialog when the outside is clicked                                  |
| `defaultOpen`                                                    | `boolean`                                  | No                                                             | The initial open state of the dialog when rendered.                                      |
| Use when you don't need to control the open state of the dialog. |                                            |                                                                |                                                                                          |
| `finalFocusEl`                                                   | `() => MaybeElement`                       | No                                                             | Element to receive focus when the dialog is closed                                       |
| `id`                                                             | `string`                                   | No                                                             | The unique identifier of the machine.                                                    |
| `ids`                                                            | `Partial<{                                 |                                                                |                                                                                          |
| trigger: string                                                  |                                            |                                                                |                                                                                          |
| positioner: string                                               |                                            |                                                                |                                                                                          |
| backdrop: string                                                 |                                            |                                                                |                                                                                          |
| content: string                                                  |                                            |                                                                |                                                                                          |
| closeTrigger: string                                             |                                            |                                                                |                                                                                          |
| title: string                                                    |                                            |                                                                |                                                                                          |
| description: string                                              |                                            |                                                                |                                                                                          |
| }>`                                                              | No                                         | The ids of the elements in the dialog. Useful for composition. |                                                                                          |
| `immediate`                                                      | `boolean`                                  | No                                                             | Whether to synchronize the present change immediately or defer it to the next frame      |
| `initialFocusEl`                                                 | `() => MaybeElement`                       | No                                                             | Element to receive focus when the dialog is opened                                       |
| `lazyMount`                                                      | `boolean`                                  | No                                                             | Whether to enable lazy mounting                                                          |
| `modal`                                                          | `boolean`                                  | No                                                             | Whether to prevent pointer interaction outside the element and hide all content below it |
| `onEscapeKeyDown`                                                | `(event: KeyboardEvent) => void`           | No                                                             | Function called when the escape key is pressed                                           |
| `onExitComplete`                                                 | `VoidFunction`                             | No                                                             | Function called when the animation ends in the closed state                              |
| `onFocusOutside`                                                 | `(event: FocusOutsideEvent) => void`       | No                                                             | Function called when the focus is moved outside the component                            |
| `onInteractOutside`                                              | `(event: InteractOutsideEvent) => void`    | No                                                             | Function called when an interaction happens outside the component                        |
| `onOpenChange`                                                   | `(details: OpenChangeDetails) => void`     | No                                                             | Function to call when the dialog's open state changes                                    |
| `onPointerDownOutside`                                           | `(event: PointerDownOutsideEvent) => void` | No                                                             | Function called when the pointer is pressed down outside the component                   |
| `onRequestDismiss`                                               | `(event: LayerDismissEvent) => void`       | No                                                             | Function called when this layer is closed due to a parent layer being closed             |
| `open`                                                           | `boolean`                                  | No                                                             | The controlled open state of the dialog                                                  |
| `persistentElements`                                             | `(() => Element                            | null)[]`                                                       | No                                                                                       |

- should not have pointer-events disabled
- should not trigger the dismiss event |
  | `present` | `boolean` | No | Whether the node is present (controlled by the user) |
  | `preventScroll` | `boolean` | No | Whether to prevent scrolling behind the dialog when it's opened |
  | `restoreFocus` | `boolean` | No | Whether to restore focus to the element that had focus before the dialog was opened |
  | `role` | `'alertdialog' | 'dialog'` | No | The dialog's role |
  | `skipAnimationOnMount` | `boolean` | No | Whether to allow the initial presence animation. |
  | `trapFocus` | `boolean` | No | Whether to trap focus inside the dialog when it's opened |
  | `unmountOnExit` | `boolean` | No | Whether to unmount on exit. |

**Backdrop Props:**

| Prop      | Type                        | Required | Description                                                                                         |
| --------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'div'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                   | No       |                                                                                                     |

**Backdrop Data Attributes:**

| Attribute      | Value    |
| -------------- | -------- |
| `[data-scope]` | dialog   |
| `[data-part]`  | backdrop |
| `[data-state]` | "open"   |

**Backdrop CSS Variables:**

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `--layer-index` | The index of the dismissable in the layer stack |

**CloseTrigger Props:**

| Prop      | Type                           | Required | Description                                                                                         |
| --------- | ------------------------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'button'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                      | No       |                                                                                                     |

**Content Props:**

| Prop      | Type                        | Required | Description                                                                                         |
| --------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'div'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                   | No       |                                                                                                     |

**Content Data Attributes:**

| Attribute           | Value   |
| ------------------- | ------- |
| `[data-scope]`      | dialog  |
| `[data-part]`       | content |
| `[data-state]`      | "open"  |
| `[data-nested]`     | dialog  |
| `[data-has-nested]` | dialog  |

**Content CSS Variables:**

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `--layer-index`        | The index of the dismissable in the layer stack |
| `--nested-layer-count` | The number of nested dialogs                    |

**Description Props:**

| Prop      | Type                      | Required | Description                                                                                         |
| --------- | ------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'p'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                 | No       |                                                                                                     |

**Positioner Props:**

| Prop      | Type                        | Required | Description                                                                                         |
| --------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'div'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                   | No       |                                                                                                     |

**RootProvider Props:**

| Prop    | Type              | Required | Description |
| ------- | ----------------- | -------- | ----------- |
| `value` | `UseDialogReturn` | Yes      |             |

**Title Props:**

| Prop      | Type                       | Required | Description                                                                                         |
| --------- | -------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'h2'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                  | No       |                                                                                                     |

**Trigger Props:**

| Prop      | Type                           | Required | Description                                                                                         |
| --------- | ------------------------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `asChild` | `Snippet<[PropsFn<'button'>]>` | No       | Use the provided child element as the default rendered element, combining their props and behavior. |
| `ref`     | `Element`                      | No       |                                                                                                     |

**Trigger Data Attributes:**

| Attribute      | Value   |
| -------------- | ------- |
| `[data-scope]` | dialog  |
| `[data-part]`  | trigger |
| `[data-state]` | "open"  |

### Context

**API:**

| Property  | Type                      | Description                          |
| --------- | ------------------------- | ------------------------------------ |
| `open`    | `boolean`                 | Whether the dialog is open           |
| `setOpen` | `(open: boolean) => void` | Function to open or close the dialog |

## Accessibility

Complies with the [Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### Keyboard Support
