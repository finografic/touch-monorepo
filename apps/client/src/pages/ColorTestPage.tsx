/**
 * Color Test Page - Debug and verify color system
 * Access at: /color-test
 */

import { css } from '@emotion/react';
import { useColors, useThemeName } from 'styles';

export function ColorTestPage() {
  const colors = useColors();
  const themeName = useThemeName();

  const pageStyles = css`
    padding: 2rem;
    min-height: 100vh;
    background: ${colors.background};
    color: ${colors.text};
  `;

  const cardStyles = css`
    background: ${colors.white};
    border: 2px solid ${colors.primary};
    border-radius: 0.5rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 8px ${colors.black25};
  `;

  const colorSwatchStyles = (color: string) => css`
    width: 100px;
    height: 100px;
    background: ${color};
    border: 2px solid ${colors.grey};
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: ${colors.text};
    font-weight: 600;
  `;

  const buttonStyles = (bgColor: string, textColor: string) => css`
    background: ${bgColor};
    color: ${textColor};
    border: 2px solid ${bgColor};
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    margin-right: 1rem;
    margin-bottom: 1rem;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `;

  return (
    <div css={pageStyles}>
      <h1 css={css`color: ${colors.primary}; margin-bottom: 2rem;`}>
        Color System Test Page
      </h1>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Theme Info
        </h2>
        <p css={css`margin-bottom: 0.5rem;`}>
          <strong>Current Theme:</strong> {themeName}
        </p>
        <p css={css`margin-bottom: 0.5rem;`}>
          <strong>Background Color:</strong> {colors.background}
        </p>
        <p css={css`margin-bottom: 0.5rem;`}>
          <strong>Text Color:</strong> {colors.text}
        </p>
        <p css={css`margin-bottom: 0.5rem;`}>
          <strong>Primary Color:</strong> {colors.primary}
        </p>
      </div>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Base Colors
        </h2>
        <div css={css`display: flex; gap: 1rem; flex-wrap: wrap;`}>
          <div css={colorSwatchStyles(colors.primary)}>Primary</div>
          <div css={colorSwatchStyles(colors.secondary)}>Secondary</div>
          <div css={colorSwatchStyles(colors.success)}>Success</div>
          <div css={colorSwatchStyles(colors.warning)}>Warning</div>
          <div css={colorSwatchStyles(colors.danger)}>Danger</div>
          <div css={colorSwatchStyles(colors.info)}>Info</div>
        </div>
      </div>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Shade Variants (Primary)
        </h2>
        <div css={css`display: flex; gap: 1rem; flex-wrap: wrap;`}>
          <div css={colorSwatchStyles(colors.primaryXXLight)}>XXLight</div>
          <div css={colorSwatchStyles(colors.primaryXLight)}>XLight</div>
          <div css={colorSwatchStyles(colors.primaryLight)}>Light</div>
          <div css={colorSwatchStyles(colors.primary)}>Base</div>
          <div css={colorSwatchStyles(colors.primaryDark)}>Dark</div>
          <div css={colorSwatchStyles(colors.primaryXDark)}>XDark</div>
          <div css={colorSwatchStyles(colors.primaryXXDark)}>XXDark</div>
        </div>
      </div>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Transparency Variants
        </h2>
        <div css={css`
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          background: ${colors.greyLight};
          padding: 1rem;
          border-radius: 0.5rem;
        `}>
          <div css={colorSwatchStyles(colors.primary)}>100%</div>
          <div css={colorSwatchStyles(colors.primary75)}>75%</div>
          <div css={colorSwatchStyles(colors.primary50)}>50%</div>
          <div css={colorSwatchStyles(colors.primary25)}>25%</div>
        </div>
      </div>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Button Variants
        </h2>
        <div>
          <button css={buttonStyles(colors.primaryLight, colors.white)}>
            Primary Button
          </button>
          <button css={buttonStyles(colors.successLight, colors.white)}>
            Success Button
          </button>
          <button css={buttonStyles(colors.warningLight, colors.white)}>
            Warning Button
          </button>
          <button css={buttonStyles(colors.dangerLight, colors.white)}>
            Danger Button
          </button>
          <button css={buttonStyles(colors.infoLight, colors.white)}>
            Info Button
          </button>
        </div>
      </div>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Gradient Test
        </h2>
        <div css={css`
          background: linear-gradient(
            135deg,
            ${colors.primaryLight},
            ${colors.secondaryLight}
          );
          height: 150px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${colors.white};
          font-size: 1.5rem;
          font-weight: 600;
        `}>
          Smooth Gradient
        </div>
      </div>

      <div css={cardStyles}>
        <h2 css={css`color: ${colors.primary}; margin-bottom: 1rem;`}>
          Debug Info
        </h2>
        <details>
          <summary css={css`cursor: pointer; font-weight: 600; margin-bottom: 1rem;`}>
            Show All Colors (Click to expand)
          </summary>
          <pre css={css`
            background: ${colors.greyXXLight};
            padding: 1rem;
            border-radius: 0.375rem;
            overflow: auto;
            max-height: 400px;
            font-size: 0.875rem;
          `}>
            {JSON.stringify(colors, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

