import { css } from '@emotion/react';

export const styles = css`
  padding: 2rem 0;
  background: #ffffff;
  min-height: 100vh;

  h1 {
    color: #00c6ff;
    margin-bottom: 2rem;
  }

  .schema-section {
    background: #f5f5f5;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;

    h2 {
      color: #333;
      margin-bottom: 2rem;
    }

    .mermaid-container {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;

      /* Style Mermaid diagram */
      :global(.mermaid) {
        display: flex;
        justify-content: center;

        svg {
          max-width: 100%;
          height: auto;
        }
      }
    }

    .schema-legend {
      h3 {
        color: #333;
        margin: 1.5rem 0 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 0.5rem;
          color: #666;

          strong {
            color: #333;
          }
        }
      }
    }
  }
`;
