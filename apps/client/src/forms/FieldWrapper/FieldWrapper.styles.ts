import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  flex: 1;
  display: block;
  position: relative;
  min-width: 180px;
  padding: 0.5rem 0 0.25rem;

  & + div {
    width: 100%;
  }
`;
