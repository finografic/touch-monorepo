import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${colors.grayXXDark};
  color: ${colors.textLight};
  z-index: 9999;

  h2 {
    color: ${colors.error};
    margin-bottom: 1rem;
  }

  details {
    width: 100%;
    max-width: 800px;
    background-color: ${colors.grayXDark};
    padding: 1rem;
    border-radius: 4px;

    summary {
      cursor: pointer;
      color: ${colors.info};
      margin-bottom: 1rem;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: monospace;
      font-size: 0.85rem;
      line-height: 1.4;
      color: ${colors.textLight};
      opacity: 0.8;
    }
  }
`;
