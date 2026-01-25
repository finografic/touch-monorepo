import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { Visible } from 'react-grid-system'; // DEPRECATED: consider using react-grid-layout

import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
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
