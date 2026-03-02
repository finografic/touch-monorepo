import { css } from '@emotion/react';
// import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  ul {
    background-color: transparent !important;
    line-height: 1.8 !important;
    font-size: 14px !important;
  }

  /* Hide spans containing {} which have specific margin styling */
  span[style*='margin-left: 0.3em'][style*='margin-right: 0.3em'] {
    display: none;
  }
`;

export const stylesTheme = {
  container: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '12px',
    lineHeight: '5',
    backgroundColor: 'transparent',
  },
  null: { color: '#7f7f7f' },
  undefined: { color: '#7f7f7f' },
  string: { color: '#cd9077' },
  number: { color: '#6b9955' },
  boolean: { color: '#569cd6' },
  key: { color: '#9cdcfe' },
  punctuation: { color: '#d4d4d4' },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
    padding: '1px 2px',
    borderRadius: '3px',
    transition: 'background-color 150ms ease',
    outline: 'none',
  },
  triggerHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  chevron: {
    color: '#d4d4d4',
    width: '20px',
    height: '20px',
    transition: 'transform 200ms ease',
    strokeWidth: 2,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
  },
  content: {
    marginLeft: '4px',
  },
} as const;
