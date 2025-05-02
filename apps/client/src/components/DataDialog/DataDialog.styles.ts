import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = {
  dataList: css`
    [data-accent-color] {
      --accent-9: ${colors.info};
    }

    [data-radix-data-list-item] {
      display: flex;
      gap: 1.5rem;
      align-items: baseline;
    }
  `,
  label: css`
    color: ${colors.info} !important;
    font-weight: 600;
    font-size: 1rem;
  `,
  value: css`
    font-size: 1rem;
  `,
  jsonView: css`
    display: block;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.7rem;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
    background-color: rgba(0, 0, 0, 0.2);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.02em;
  `,
  tabTrigger: css`
    font-size: 1rem;
  `,
  activeTabTrigger: css`
    opacity: 1;
  `,
  disabledTabTrigger: css`
    opacity: 0.35;
  `,
} as const;
