import { Visible } from 'react-grid-system';
import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { useKeyPress } from '../hooks/useKeyPress';
import { styles } from './DevScreenSize.styles';
import { useDev } from 'providers/DevProvider/DevContext';

export const DevScreenSize = ({ variant = 'light' }: { variant?: 'light' | 'dark' }): ReactElement => {
  if (import.meta.env.NODE_ENV === 'production') return <Fragment />;

  const { isDevDataVisible, setIsDevDataVisible } = useDev();
  // useKeyPress();

  const handleClick = () => {
    setIsDevDataVisible(!isDevDataVisible);
  };

  return (
    <div css={styles} onClick={handleClick} className={`dev-screen-size variant-${variant}`}>
      <pre>
        <span style={{ paddingRight: '1em' }}>{isDevDataVisible ? '(DEV)' : ''}</span>
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
