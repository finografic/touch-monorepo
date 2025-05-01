import { Loader } from 'components/Loader/Loader';
import type { FC } from 'react';

export const HydrateFallback: FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#f5f5f5',
      }}
    >
      <Loader />
    </div>
  );
};
