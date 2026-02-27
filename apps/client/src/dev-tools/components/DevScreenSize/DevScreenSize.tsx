import type { ReactElement, ReactNode } from 'react';
import { Fragment } from 'react';

import { css } from '@emotion/react';

import { useDev } from 'dev-tools/providers/DevProvider/DevContext';

type VisibleProps = { xs?: boolean; sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean; xxl?: boolean; children: ReactNode };
const Visible = ({ xs, sm, md, lg, xl, xxl, children }: VisibleProps) => {
  const style = xs
    ? css`display: inline; @media (min-width: 640px) { display: none; }`
    : sm
    ? css`display: none; @media (min-width: 640px) { display: inline; } @media (min-width: 768px) { display: none; }`
    : md
    ? css`display: none; @media (min-width: 768px) { display: inline; } @media (min-width: 1024px) { display: none; }`
    : lg
    ? css`display: none; @media (min-width: 1024px) { display: inline; } @media (min-width: 1280px) { display: none; }`
    : xl
    ? css`display: none; @media (min-width: 1280px) { display: inline; } @media (min-width: 1536px) { display: none; }`
    : css`display: none; @media (min-width: 1536px) { display: inline; }`;
  return <span css={style}>{children}</span>;
};
import { styles } from './DevScreenSize.styles';

export const DevScreenSize = ({ variant = 'dark' }: { variant?: 'light' | 'dark' }): ReactElement => {
  if (import.meta.env.NODE_ENV === 'production') return <Fragment />;

  const { isDevScreenSizeVisible, setIsDevScreenSizeVisible } = useDev();

  const handleClick = () => {
    setIsDevScreenSizeVisible(!isDevScreenSizeVisible);
  };

  return (
    <div id="___SIZE___" css={styles} onClick={handleClick} className={`dev-screen-size variant-${variant}`}>
      <pre>
        <span style={{ paddingRight: '1em' }}>{isDevScreenSizeVisible ? '(DEV)' : ''}</span>
        <Visible xs>XS</Visible>
        <Visible sm>SM</Visible>
        <Visible md>MD</Visible>
        <Visible lg>LG</Visible>
        <Visible xl>XL</Visible>
        <Visible xxl>XXL</Visible> - {window.innerWidth}px
      </pre>
    </div>
  );
};
