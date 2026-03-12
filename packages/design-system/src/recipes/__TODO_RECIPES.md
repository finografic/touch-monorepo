Perfect — using **your exact recipe filenames**, here is the correct **`cva` vs `sva` classification** based on typical Panda + Ark UI usage.

You can **save this as your refactor checklist**.

---

# `cva` (single-root components)

Use **`cva`** for these recipes:

```
badge.recipe.ts
button.recipe.ts
callout.recipe.ts
card.recipe.ts
input.recipe.ts
label.recipe.ts
switch.recipe.ts
text.recipe.ts
```

These components normally render **one styled element**.

Example mental model:

```
<Button />
  → button element

<Card />
  → div

<Text />
  → span / p
```

No slots → **`cva`**.

---

# `sva` (multi-slot components)

Use **`sva`** for these recipes:

```
checkbox.recipe.ts
dialog.recipe.ts
form-field.recipe.ts
menu.recipe.ts
popover.recipe.ts
select.recipe.ts
table.recipe.ts
tabs.recipe.ts
toast.recipe.ts
tooltip.recipe.ts
```

These are **compound components** with multiple styled parts.

Example mental model:

```
Dialog
 ├─ backdrop
 ├─ positioner
 ├─ content
 ├─ header
 ├─ body
 └─ footer
```

Multiple parts → **`sva`**.

---

# Special Notes For Your Stack

Because you are using **Ark UI**, these are *definitely* slot recipes:

```
checkbox
dialog
menu
popover
select
tabs
tooltip
```

Ark primitives expose **multiple DOM parts**, so `sva` is correct.

---

# One Borderline Case

```
form-field.recipe.ts
```

This is **almost always `sva`** because it contains:

```
FormField
 ├─ root
 ├─ label
 ├─ helperText
 ├─ errorText
 └─ control
```

So keep it **`sva`**.

---

# Your Final Reference List

## cva

```
badge
button
callout
card
input
label
switch
text
```

## sva

```
checkbox
dialog
form-field
menu
popover
select
table
tabs
toast
tooltip
```

---

# Next Step

Now we go **file-by-file**.

Start with:

```
callout.recipe.ts
```

Paste it, and I’ll return the **correct Panda recipe** for it.
