import { css } from '@emotion/react';
import { colors } from 'styles';
import { stylesNavButton } from 'styles/custom/buttons.styles';

export const styles = css`
  &[role='dialog'] {
    width: 66vw !important;
    height: 100%;
    min-height: 960px;
    max-height: 66vh;
    padding-bottom: 0;
    max-width: unset;
    overflow: hidden;

    h1 {
      font-size: 2.25rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .close-button {
      transform: scale(1.5) translate(-25%);
      color: ${colors.greyLight};
      &:hover {
        color: ${colors.warning};
        background-color: transparent;
        cursor: pointer;
      }
    }

    [role='tablist'] {
      [role='tab'] {
        height: 64px;
        font-size: 1.2rem;
        font-weight: 500;
        padding-bottom: 0;
        line-height: 1.2;
        padding: 1.5rem 1rem;
      }
      + div {
        height: 100%;
        height: 48vh;
      }
    }

    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
      padding: 1.5rem 0 1rem;
      background: transparent;

      button {
        ${stylesNavButton}
        border: 2px solid ${colors.greyDark};
        padding: 1.5rem 1rem;
        font-weight: 500;
        background-color: transparent;
      }
    }

    /* Data List View Styles */
    .dataList {
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

      .label {
        color: ${colors.info} !important;
        font-weight: 600;
        font-size: 1rem;
      }

      .value {
        font-size: 1rem;
      }
    }

    /* JSON View Styles */
    .jsonView {
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
    }

    /* Config Content Styles */
    .configContent {
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
    }

    /* Dialog Content Styles */
    .dialogContent {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Tab Content Styles */
    .tabContent {
      flex: 1;
      min-height: 0;
      padding: 2rem 0 0;
      position: relative;

      [data-state='active'] {
        height: 100%;
        overflow-y: auto;
        padding-bottom: 1rem;
      }
    }
  }

  code {
    flex: 1;
    display: flex;
    overflow-y: scroll;
  }

  & > div:nth-of-type(4) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    button {
      padding: 1rem 3rem;
    }
  }
`;
