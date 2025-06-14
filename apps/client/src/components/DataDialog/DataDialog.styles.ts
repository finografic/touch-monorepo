import { css } from '@emotion/react';
import { colors } from 'styles';
import { stylesNavButton, stylesPad } from 'styles/custom/buttons.styles';

export const styles = css`
  /* width: 90vw; */
  /* max-width: 500px; */
  /* min-height: 880px; */

  &[role='dialog'] {
    width: 66vw !important;
    height: 100%;
    min-height: 960px;
    max-height: 66vh;
    padding-bottom: 0;
    max-width: unset;
    overflow: hidden;

    /* display: flex;
    flex-direction: column; */

    .close-button {
      /* position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    color: ${colors.greyLight}; */

      transform: translateY(-33%);
      color: ${colors.greyLight};
      &:hover {
        color: ${colors.warning};
        background-color: transparent;
        cursor: pointer;
      }
    }

    [role='tablist'] {
      [role='tab'] {
        height: 52px;
        /* height: 48vh; */
        /* min-height: 960px;
    max-height: 66vh; */
        /* padding-bottom: 0;
    display: flex;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid red; */
      }

      + div {
        height: 100%;
        height: 54vh;
        /* min-height: 960px;
    max-height: 66vh; */
        /* padding-bottom: 0;
    display: flex;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid red; */
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
        /* font-size: 1rem; */
        font-weight: 500;
        /* color: ${colors.greyLight}; */
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
      padding: 1.5rem 1rem 0;
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
    /* height: 100%; */
    /* max-height: 640px; */
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
    /* margin-top: auto; */
    button {
      padding: 1rem 3rem;
    }
  }

  /* div[role='dialog'][data-state='open'] {
    width: 90vw;
    max-width: 500px;
    max-height: 85vh;
    min-height: 880px;
    display: none;
  } */
  /* .DialogOverlay {
    background-color: ${colors.black}99;
    position: fixed;
    inset: 0;
    animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .rt-DialogContent {
    display: none;
    background-color: var(--gray-1);
    border-radius: 6px;
    box-shadow: var(--shadow-6);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 500px;
    max-height: 85vh;
    min-height: 880px;
    padding: 25px;
    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .DialogContent:focus {
    outline: none;
  }

  .DialogTitle {
    margin: 0;
    font-weight: 500;
    color: ${colors.greyXLight};
    font-size: 17px;
  }

  .DialogDescription {
    margin: 10px 0 20px;
    color: ${colors.greyLight};
    font-size: 15px;
    line-height: 1.5;
  } */
`;
