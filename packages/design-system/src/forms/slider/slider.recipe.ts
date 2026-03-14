/**
 * Slider Recipe
 *
 * Slots:    root · label · valueText · control · track · range · thumb · markerGroup · marker
 * Variants: size (sm | md | lg) · orientation (horizontal | vertical)
 */
import { sva } from '@styled-system/css';

export const sliderRecipe = sva({
  className: 'slider',

  slots: ['root', 'label', 'valueText', 'control', 'track', 'range', 'thumb', 'markerGroup', 'marker'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3',
      width: '100%',
    },

    label: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'semibold',
      color: 'fg.muted',
      userSelect: 'none',
    },

    valueText: {
      color: 'fg',
      fontWeight: 'semibold',
      fontVariantNumeric: 'tabular-nums',
    },

    control: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    track: {
      position: 'relative',
      flex: '1',
      borderRadius: 'full',
      bg: 'bg.emphasized',
      overflow: 'hidden',
    },

    range: {
      position: 'absolute',
      bg: 'accent.solid',
      borderRadius: 'full',
    },

    thumb: {
      display: 'block',
      borderRadius: 'full',
      bg: 'white',
      borderWidth: 'default',
      borderStyle: 'solid',
      borderColor: 'accent.solid',
      boxShadow: 'sm',
      cursor: 'grab',
      transitionProperty: 'box-shadow',
      transitionDuration: 'fast',
      _focusVisible: { outline: '2px solid', outlineColor: 'accent.focusRing', outlineOffset: '2px', boxShadow: 'md' },
      _active: { cursor: 'grabbing' },
      _disabled: { opacity: 0.55, cursor: 'not-allowed' },
    },

    markerGroup: {
      display: 'flex',
      justifyContent: 'space-between',
    },

    marker: {
      fontSize: 'xs',
      color: 'fg.subtle',
    },
  },

  variants: {
    size: {
      sm: {
        label: { fontSize: 'xs' },
        valueText: { fontSize: 'xs' },
        track: { height: '1' },
        range: { height: '100%' },
        thumb: { width: '4', height: '4', marginTop: '-1.5' },
      },
      md: {
        label: { fontSize: 'sm' },
        valueText: { fontSize: 'sm' },
        track: { height: '1.5' },
        range: { height: '100%' },
        thumb: { width: '5', height: '5', marginTop: '-1.75' },
      },
      lg: {
        label: { fontSize: 'md' },
        valueText: { fontSize: 'md' },
        track: { height: '2' },
        range: { height: '100%' },
        thumb: { width: '6', height: '6', marginTop: '-2' },
      },
    },
  },

  defaultVariants: { size: 'md' },
});
