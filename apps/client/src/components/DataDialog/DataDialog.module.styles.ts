import { css } from '@emotion/react';
import { colors } from 'styles';

export const moduleStyles = {
  dialogContent: css`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  dataList: css`
    [data-accent-color] {
      --accent-9: ${colors.info};
    }

    [data-radix-data-list-item] {
      display: flex;
      gap: 1.5rem;
      align-items: baseline;
    }
    height: 100%;
    overflow-y: auto;
    padding: 0.5rem 0;
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
    font-size: 0.8rem;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
    background-color: rgba(0, 0, 0, 0.2);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.02em;
    overflow-y: auto;
    height: 100%;
  `,
  activeTabTrigger: css`
    opacity: 1;
  `,
  disabledTabTrigger: css`
    opacity: 0.35;
  `,
  tabContent: css`
    flex: 1;
    min-height: 0;
    padding: 1.5rem 1rem 0;
    position: relative;

    [data-state='active'] {
      height: 100%;
      overflow-y: auto;
      padding-bottom: 1rem;
    }
  `,
  configContent: css`
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1rem;

    .config-timer {
      color: ${colors.warningDark};
      margin-bottom: 1rem;
      padding: 0.2rem 0;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
  `,
  languageSelector: css`
    height: 100%;
    overflow-y: auto;
    padding: 1rem 0;

    /* Radio Cards styling for vertical layout */
    [data-radix-radio-cards-root] {
      gap: 0.75rem;
    }

    [data-radix-radio-cards-item] {
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      &[data-state='checked'] {
        background-color: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.5);
      }
    }
  `,
} as const;
