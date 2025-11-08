import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  padding: 20px;
  background-color: #f8d7da;
  color: ${colors.dangerDark};
  border-radius: 5px;
  max-width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    margin-bottom: 20px;
  }

  details {
    margin-bottom: 20px;
  }

  summary {
    cursor: pointer;
    font-weight: bold;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
  }

  a {
    display: inline-block;
    padding: 10px 15px;
    background-color: ${colors.info};
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
  }
`;
