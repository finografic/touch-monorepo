import { css } from '@emotion/react';

export const styles = css`
  .rt-CalloutRoot {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    .rt-CalloutIcon {
      font-size: 1.5rem;
      transform: scale(1.5) translate(-33%, 3%);
    }
    p {
      padding: 0;
    }
  }
`;
