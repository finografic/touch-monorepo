import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Header content styling - layout handled by Layout.styles.ts */
  width: 100%;
  padding: 0 2.5rem;

  /* 3-column layout: 3:6:3 ratio */
  .row-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .col-header-left {
    flex: 3;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem; /* Add some padding for better visual balance */
  }

  .col-header-center {
    flex: 6;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .col-header-right {
    flex: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 1rem; /* Add some padding for better visual balance */
  }

  /* ======================================= */
  /* Debug borders - uncomment to see layout */
  .row-header {
    border: 1px solid ${colors.greyDark};
  }
  .col-header-left,
  .col-header-center,
  .col-header-right {
    border: 1px solid ${colors.greyDark};
  }
  /* ======================================= */

  h1 {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-info);
    margin: 0 0 0 0.8rem;

    span.current-language {
      font-size: 1.6rem;
      font-weight: 600;
      color: var(--color-info);
      margin: 0 0 0 0.8rem;
      opacity: 0.4;
      transform: translateY(-4%);
      text-transform: none;
    }
  }

  div[role='menuitem'][data-highlighted] {
    color: var(--color-white) !important;
    background-color: transparent !important;
  }

  .current-language {
    color: var(--color-grey);
    font-size: 1.1rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dev-session-a,
  .dev-session-b {
    color: var(--color-grey-xlight);
    font-size: 0.9rem;
    font-weight: 400;
    position: absolute;
    top: 3vw;
    text-align: center;
  }

  .dev-session-b {
    text-align: left;
    top: 5vw;
    font-size: 0.8rem;
  }
`;
