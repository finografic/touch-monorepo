# Interpolation & i18n Features Without ParaglideJS

You're right - plain JavaScript objects don't have interpolation! But we've added simple utilities to give you all the features you need.

## ✅ Features Available

1. **String Interpolation** - `{key}` replacement
2. **Pluralization** - zero, one, other forms
3. **Number Formatting** - Locale-specific numbers
4. **Date Formatting** - Locale-specific dates

## 🚀 Usage Examples

### 1. Basic Interpolation

```typescript
import { getMessages, interpolate } from '@workspace/i18n';

const messages = getMessages(currentLanguage);

// Message: "Welcome, {name}!"
const welcome = interpolate(messages.admin.welcome, { name: 'John' });
// Result: "Welcome, John!"
```

### 2. Pluralization

```typescript
import { getMessages, pluralize } from '@workspace/i18n';

const messages = getMessages(currentLanguage);

// Messages:
// {
//   zero: 'No items',
//   one: '1 item',
//   other: '{count} items'
// }

const count0 = pluralize(0, messages.admin.itemCount);
// Result: "No items"

const count1 = pluralize(1, messages.admin.itemCount);
// Result: "1 item"

const count5 = pluralize(5, messages.admin.itemCount);
// Result: "5 items"
```

### 3. Number Formatting

```typescript
import { formatNumber } from '@workspace/i18n';

// English (Great Britain)
formatNumber(1234.56, 'en-GB');
// Result: "1,234.56"

// Spanish (Spain)
formatNumber(1234.56, 'es-ES');
// Result: "1.234,56"

// With currency
formatNumber(1234.56, 'en-GB', { style: 'currency', currency: 'GBP' });
// Result: "£1,234.56"
```

### 4. Date Formatting

```typescript
import { formatDate } from '@workspace/i18n';

const date = new Date('2025-10-19');

// English (Great Britain)
formatDate(date, 'en-GB');
// Result: "19/10/2025"

// Spanish (Spain)
formatDate(date, 'es-ES');
// Result: "19/10/2025"

// Full date format
formatDate(date, 'en-GB', { dateStyle: 'full' });
// Result: "Sunday, 19 October 2025"

formatDate(date, 'es-ES', { dateStyle: 'full' });
// Result: "domingo, 19 de octubre de 2025"
```

## 📝 Message Structure

### Simple Strings

```typescript
export const messages = {
  admin: {
    title: 'Dashboard',
    description: 'System overview',
  },
};

// Usage
const title = messages.admin.title;
```

### With Interpolation

```typescript
export const messages = {
  admin: {
    welcome: 'Welcome, {name}!',
    greeting: 'Hello {firstName} {lastName}!',
  },
};

// Usage
const welcome = interpolate(messages.admin.welcome, { name: 'John' });
const greeting = interpolate(messages.admin.greeting, {
  firstName: 'John',
  lastName: 'Doe'
});
```

### With Pluralization

```typescript
export const messages = {
  admin: {
    itemCount: {
      zero: 'No items',
      one: '1 item',
      other: '{count} items',
    },
    orderCount: {
      one: '{count} order pending',
      other: '{count} orders pending',
    },
  },
};

// Usage
const items = pluralize(5, messages.admin.itemCount);
const orders = pluralize(3, messages.admin.orderCount);
```

## 🎯 Real-World Example

```typescript
// In your component
import { getMessages, interpolate, pluralize, formatDate } from '@workspace/i18n';
import { useAppConfig } from '@workspace/core';

export const AdminDashboardPage = () => {
  const { currentLanguage } = useAppConfig();
  const messages = getMessages(currentLanguage);
  const user = { name: 'John' };
  const orderCount = 5;
  const lastUpdate = new Date();

  return (
    <div>
      {/* Simple message */}
      <h1>{messages.admin.pages.dashboard.title}</h1>

      {/* Interpolation */}
      <p>{interpolate(messages.admin.welcome, { name: user.name })}</p>

      {/* Pluralization */}
      <p>{pluralize(orderCount, messages.admin.itemCount)}</p>

      {/* Date formatting */}
      <p>
        {interpolate(messages.admin.lastUpdated, {
          date: formatDate(lastUpdate, currentLanguage, { dateStyle: 'medium' }),
        })}
      </p>
    </div>
  );
};
```

## 🔥 Advanced: Create a Custom Hook

```typescript
// In packages/i18n/src/hooks/useMessages.ts
import { useAppConfig } from '@workspace/core';
import { getMessages, interpolate, pluralize, formatNumber, formatDate } from '../utils';

export function useMessages() {
  const { currentLanguage } = useAppConfig();
  const messages = getMessages(currentLanguage);

  return {
    messages,
    t: (key: string, params?: Record<string, any>) => {
      // Simple path-based access like t('admin.welcome', { name: 'John' })
      const message = key.split('.').reduce((obj, k) => obj?.[k], messages as any);
      return params ? interpolate(message, params) : message;
    },
    plural: (count: number, forms: any) => pluralize(count, forms),
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, currentLanguage, options),
    date: (value: Date, options?: Intl.DateTimeFormatOptions) =>
      formatDate(value, currentLanguage, options),
  };
}
```

**Usage:**

```typescript
export const AdminDashboardPage = () => {
  const { messages, t, plural, number, date } = useMessages();

  return (
    <div>
      <h1>{t('admin.pages.dashboard.title')}</h1>
      <p>{t('admin.welcome', { name: 'John' })}</p>
      <p>{plural(5, messages.admin.itemCount)}</p>
      <p>{number(1234.56, { style: 'currency', currency: 'GBP' })}</p>
      <p>{date(new Date(), { dateStyle: 'full' })}</p>
    </div>
  );
};
```

## 📊 Comparison with ParaglideJS

| Feature | Your Custom Setup | ParaglideJS |
|---------|------------------|-------------|
| Interpolation | ✅ `interpolate()` | ✅ Auto-generated |
| Pluralization | ✅ `pluralize()` | ✅ Auto-generated |
| Number Format | ✅ `formatNumber()` | ✅ Auto-generated |
| Date Format | ✅ `formatDate()` | ✅ Auto-generated |
| Type Safety | ✅ TypeScript | ✅ TypeScript |
| HMR | ✅ Perfect | ❌ Requires rebuild |
| Complexity | ⭐⭐ Simple | ⭐⭐⭐⭐ Complex |
| Build Step | ⏩ Fast | ⏸️ Slow |
| Control | ✅ Full | ⚠️ Limited |

## ✅ Summary

**You DON'T need ParaglideJS for interpolation!**

Your custom setup provides:
- ✅ String interpolation
- ✅ Pluralization
- ✅ Number/date formatting
- ✅ Full type safety
- ✅ HMR support
- ✅ Simple, understandable code

**Just use the utility functions we've provided!** 🎉

