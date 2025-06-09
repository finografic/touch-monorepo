import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* width: 90vw; */
  /* max-width: 500px; */
  /* min-height: 880px; */

  &[role='dialog'] {
    width: 66vw;
    height: 100%;
    min-height: 960px;
    max-height: 66vh;
    padding-bottom: 0;
    /* display: flex;
    flex-direction: column; */
  }

  [role='tablist'] + div {
    height: 100%;
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

  code {
    flex: 1;
    display: flex;
    /* height: 100%; */
    /* max-height: 640px; */
    overflow-y: scroll;
  }

  & > div:nth-child(4) {
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
