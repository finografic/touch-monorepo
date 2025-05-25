import { css } from '@emotion/react';
import { colors, spacing, typography } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.background};
  flex: 1;

  main,
  header,
  footer {
    width: 100vw;
  }

  /* <<< DEVELOPMENT **************************/

  main {
    /* box-shadow: inset 0 0 0 2px red; */
  }
  div.main-content {
    /* border: 1px solid yellow; */
  }
  header {
    /* box-shadow: inset 0 0 0 2px blue; */
  }
  footer {
    /* box-shadow: inset 0 0 0 2px blue; */
  }
  section {
    /* box-shadow: inset 0 0 0 2px green; */
  }

  /*********************** DEVELOPMENT >>> */

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  div.main-content {
    width: 66vw;
    height: 66vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  section {
    width: 66%;
    padding: 2rem;
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

  p {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 400px;
    line-height: 1.6;
    /* margin-top: -60%; */
    padding-bottom: 2rem;
  }
`;
