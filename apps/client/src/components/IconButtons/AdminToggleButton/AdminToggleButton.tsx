import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@finografic/design-system/components';

import type { Theme } from 'types/ui.types';
import { HomeIcon, ShieldCheckIcon } from '@finografic/icons';

export const AdminToggleButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const handleGotoAppMain = () => {
    navigate('/');
  };

  const handleGotoAdmin = () => {
    navigate('/admin');
  };

  return (
    <div>
      {isAdminPath ? (
        <Button variant="ghost" className="button button-dialog" onClick={handleGotoAppMain}>
          <HomeIcon />
        </Button>
      ) : (
        <Button variant="solid" className="button button-dialog" onClick={handleGotoAdmin}>
          <ShieldCheckIcon />
        </Button>
      )}
    </div>
  );
};
