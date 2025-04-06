import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${colors.background};
  color: ${colors.white};
  text-align: center;
  padding: 2rem;

  .splashScreen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .title {
    font-size: 4rem;
    color: ${colors.info};
    margin: 0;
  }

  .subtitle {
    font-size: 1.5rem;
    color: ${colors.text};
    margin: 0;
  }

  .stats {
    display: flex;
    gap: 3rem;
    margin: 2rem 0;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .value {
    font-size: 3.5rem;
    color: ${colors.info};
  }

  .label {
    color: ${colors.text};
    margin-top: 0.5rem;
  }

  .systemStatus {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${colors.text};
  }

  .statusDot {
    width: 8px;
    height: 8px;
    background-color: ${colors.success};
    border-radius: 50%;
  }

  .bottomLinks {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .docsLink,
  .menuLink {
    color: ${colors.info};
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover {
      color: ${colors.info}aa;
    }
  }

  .separator {
    color: ${colors.text};
  }
`;
