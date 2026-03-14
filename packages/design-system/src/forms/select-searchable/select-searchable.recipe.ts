/**
 * SelectSearchable Recipe (Combobox)
 *
 * Slots:    root · control · input · trigger · clearTrigger · leadIcon ·
 *           positioner · content · list · item · itemText · itemIndicator · emptyState · addNew
 * Variants: size (sm | md | lg)
 */
import { sva } from '@styled-system/css';

export const selectSearchableRecipe = sva({
  className: 'select-searchable',

  slots: [
    'root', 'control', 'input', 'trigger', 'clearTrigger', 'leadIcon',
    'positioner', 'content', 'list', 'item', 'itemText', 'itemIndicator',
    'emptyState', 'addNew',
  ],

  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '1.5', width: 'full' },

    control: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: 'full',
      borderWidth: 'default',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      bg: 'bg',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'fast',
      _focusWithin: { borderColor: 'accent.solid', outline: '2px solid', outlineColor: 'accent.focusRing', outlineOffset: '2px' },
      _disabled: { opacity: 0.55, cursor: 'not-allowed' },
    },

    leadIcon: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      left: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'fg.muted',
      pointerEvents: 'none',
      '&[data-interactive]': { pointerEvents: 'auto', cursor: 'pointer' },
    },

    input: {
      flex: '1',
      border: 'none',
      bg: 'transparent',
      color: 'fg',
      outline: 'none',
      _placeholder: { color: 'fg.subtle' },
      _disabled: { cursor: 'not-allowed' },
    },

    clearTrigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'fg.muted',
      cursor: 'pointer',
      borderRadius: 'sm',
      _hover: { color: 'fg' },
    },

    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'fg.muted',
      cursor: 'pointer',
      '& svg': { transition: 'transform 150ms ease' },
      _open: { '& svg': { transform: 'rotate(180deg)' } },
    },

    positioner: { zIndex: 'dropdown', width: 'var(--reference-width)' },

    content: {
      bg: 'bg.panel',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      boxShadow: 'md',
      overflowY: 'auto',
      maxH: '15rem',
      _open: { animation: 'fade-in 120ms ease' },
      _closed: { animation: 'fade-out 120ms ease' },
    },

    list: { display: 'flex', flexDirection: 'column', padding: '1' },

    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      borderRadius: 'sm',
      cursor: 'pointer',
      color: 'fg',
      userSelect: 'none',
      _highlighted: { bg: 'accent.subtle', color: 'accent.fg' },
      _selected: { fontWeight: 'semibold' },
      _disabled: { opacity: 0.55, cursor: 'not-allowed', pointerEvents: 'none' },
    },

    itemText: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5',
    },

    itemIndicator: { color: 'accent.solid', flexShrink: 0 },

    emptyState: {
      padding: '3',
      textAlign: 'center',
      color: 'fg.subtle',
    },

    addNew: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      width: 'full',
      borderRadius: 'sm',
      cursor: 'pointer',
      color: 'accent.fg',
      fontWeight: 'medium',
      bg: 'transparent',
      border: 'none',
      textAlign: 'left',
      _hover: { bg: 'accent.subtle' },
    },
  },

  variants: {
    size: {
      sm: {
        control: { h: '9' },
        leadIcon: { w: '9', h: '9' },
        input: { fontSize: 'sm', paddingInline: '9', paddingInlineEnd: '7' },
        clearTrigger: { w: '7', h: '7' },
        trigger: { w: '7', h: '7' },
        item: { px: '2', py: '1', fontSize: 'sm' },
        itemText: { fontSize: 'sm' },
        addNew: { px: '2', py: '1', fontSize: 'sm' },
        emptyState: { fontSize: 'sm' },
      },
      md: {
        control: { h: '10' },
        leadIcon: { w: '10', h: '10' },
        input: { fontSize: 'sm', paddingInline: '10', paddingInlineEnd: '8' },
        clearTrigger: { w: '8', h: '8' },
        trigger: { w: '8', h: '8' },
        item: { px: '3', py: '1.5', fontSize: 'sm' },
        itemText: { fontSize: 'sm' },
        addNew: { px: '3', py: '1.5', fontSize: 'sm' },
        emptyState: { fontSize: 'sm' },
      },
      lg: {
        control: { h: '12' },
        leadIcon: { w: '12', h: '12' },
        input: { fontSize: 'md', paddingInline: '12', paddingInlineEnd: '10' },
        clearTrigger: { w: '10', h: '10' },
        trigger: { w: '10', h: '10' },
        item: { px: '3', py: '2', fontSize: 'md' },
        itemText: { fontSize: 'md' },
        addNew: { px: '3', py: '2', fontSize: 'md' },
        emptyState: { fontSize: 'md' },
      },
    },
  },

  defaultVariants: { size: 'md' },
});
