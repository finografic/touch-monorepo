import { css } from '@emotion/react';
import { colors, spacing, typography } from 'styles';

export const styles = css`
  /********** <main> **********/
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex: 1;
  /* padding: 2rem 0; */
  width: 100vw;
  height: 100vh;
  background-color: ${colors.background};

  /* <<< DEVELOPMENT **************************/

  box-shadow: inset 0 0 0 2px red;

  div.main-content {
    border: 1px solid yellow;
  }
  header {
    box-shadow: inset 0 0 0 2px blue;
  }
  footer {
    box-shadow: inset 0 0 0 2px green;
  }

  section {
    box-shadow: inset 0 0 0 2px green;
  }

  /*********************** DEVELOPMENT >>> */

  div.main-content {
    border: 1px solid yellow;
    width: 66vw;
    height: 70vh;
  }

  header {
    width: 100vw;
  }

  footer {
    width: 100vw;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  div.app-logo {
    font-size: 1.25rem;
    font-weight: 600;
  }

  div.user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .title {
    ${typography.h1};
    color: ${colors.text};
    margin-bottom: ${spacing[4]};
  }

  .subtitle {
    ${typography.body};
    color: ${colors.textLight};
  }

  button.btn-logout {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }
`;
