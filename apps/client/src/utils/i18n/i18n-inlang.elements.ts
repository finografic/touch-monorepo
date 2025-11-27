import type { AuthRoles } from 'admin/config/admin.routes.map';
import { snakeCase } from 'change-case';
import { m } from 'i18n/messages';

// ======================================================================== //
// NEW: 🈂️ inlang/paraglide i18n translations !!
/*
# 🎯 FINAL SIMPLE VERSION

### ✓ Clean
### ✓ Flexible
### ✓ Some IntelliSense
### ✓ No schema maintenance
*/
// ======================================================================== //

//  NEW: 🌱 1. Define the stable typed parts

export type AuthRole = 'public' | 'admin';

export const messageElements = ['title', 'description'] as const;
export type MessageElement = (typeof messageElements)[number];

// NEW: 🌱 2. Simple interface for the message object

export interface MessageBundle {
  [key: string]: string;
}

// NEW: 🌱 3. LIGHTWEIGHT KEY getMessageKey helper

function getMessageKey(segments: string[], role: AuthRole | undefined, element: MessageElement) {
  return [...segments, role, element].filter(Boolean).join('_');
}

// NEW: 🌱 4. MAIN getMessageText helper

export function getMessageText(
  messages: MessageBundle,
  segments: string[],
  role: AuthRole | undefined,
  element: MessageElement,
): string {
  const key = getMessageKey(segments, role, element);
  return messages[key] ?? `⚠ Missing: ${key}`;
}

// NEW: 5. FINAL get object texts

export function getMessageTexts(
  messages: MessageBundle,
  segments: string[],
  role?: AuthRole,
): Record<MessageElement, string> {
  const out = {} as Record<MessageElement, string>;

  for (const el of messageElements) {
    out[el] = getMessageText(messages, segments, role, el);
  }

  return out;
}

/*
# ✨ Usage

```ts
const msgs = getMessageTexts(messages, ["pages", "dashboard"], "admin");

console.log(msgs.title);
console.log(msgs.description);
```

This works with IntelliSense for:

- `title`
- `description`
- `"admin"` | `"public"`

*/
