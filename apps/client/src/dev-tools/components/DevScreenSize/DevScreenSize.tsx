import { Fragment } from 'react';

import { Visible } from 'react-grid-system';

import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
import type { ReactElement } from 'react';

import { styles } from './DevScreenSize.styles';

export const DevScreenSize = ({ variant = 'light' }: { variant?: 'light' | 'dark' }): ReactElement => {
  if (import.meta.env.NODE_ENV === 'production') return <Fragment />;

  const { isDevScreenSizeVisible, setIsDevScreenSizeVisible } = useDev();

  const handleClick = () => {
    setIsDevScreenSizeVisible(!isDevScreenSizeVisible);
  };

  return (
    <div css={styles} onClick={handleClick} className={`dev-screen-size variant-${variant}`}>
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
