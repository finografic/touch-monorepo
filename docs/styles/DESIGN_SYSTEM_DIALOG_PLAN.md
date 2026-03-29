# Dialog Plan

## What's already there

components/dialog.tsx is already a solid Ark compound — Root, Backdrop, Positioner, Content, Title, Description, CloseTrigger, Header, Body, Footer.
That's the low-level layer, and it's fine.

## What GenericDialog needs

1. DS Dialog styled component (forms/Dialog/) — same compound structure with .ds-dialog__* CSS classes. The components/ version has no styling at all. The
   forms/ version bakes in the panel look (backdrop, centered card, shadow, header/body/footer layout).
2. VisuallyHidden — Radix import. Replace with a one-liner utility in the DS: <span className="sr-only"> + CSS. Or add a tiny VisuallyHidden component.
3. GenericDialog stays client-side — it's inherently app-specific (useAppConfig, tab config, your DialogConfig type). But it migrates to use DS Dialog
   instead of Radix.

## Type cleanup in DialogConfig

The theme block is all Radix color names (ruby, jade, grass...) and Radix-specific scaling. Those go away. What's left that's meaningful: appearance:
'light' | 'dark' — though with Panda CSS tokens that's handled by data-theme, not a prop.

size is Radix's '1'|'2'|'3'|'4' — replace with actual CSS sizing (maxWidth, which already exists as a direct prop).

## `onOpenChange` signature delta

Radix: onOpenChange={(open: boolean) => ...} — GenericDialog passes onClose directly.
Ark: onOpenChange={({ open }) => ...} — needs to unwrap the object. One-line fix.

# Portal container

Radix has container={portalContainer} on Dialog.Content. Ark's Dialog.Positioner portals to document.body by default — no prop needed.

# Recommended steps

1. Build forms/Dialog — styled CSS compound (backdrop, panel, header/body/footer layout)
2. Add VisuallyHidden to DS (tiny, reusable across Dialog + future uses)
3. Migrate GenericDialog — swap imports, fix onOpenChange, drop container, clean DialogConfig types
4. Migrate LanguageDeleteDialog — uses AlertDialog which maps to a Dialog variant (Ark has no separate AlertDialog — same Dialog with role="alertdialog"
   on Content)

Want to start building, or any changes to this approach first?
