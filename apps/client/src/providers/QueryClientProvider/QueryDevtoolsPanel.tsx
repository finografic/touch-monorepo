import React from 'react';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';

export const QueryDevtoolsPanel = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const styles: React.CSSProperties = {
    position: 'fixed',
    bottom: '2vh',
    right: '2vw',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <>
      <button
        style={{ ...styles }}
        onClick={() => setIsOpen(!isOpen)}
      >{`${isOpen ? 'Close' : 'Open'} QueryDevtoolsPanel`}</button>
      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};
