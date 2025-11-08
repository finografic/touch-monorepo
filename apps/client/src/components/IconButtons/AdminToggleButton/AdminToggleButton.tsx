import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from 'components/Button';

import type { Theme } from 'types/ui.types';
import { HomeIcon, ShieldCheckIcon } from 'styles/icons';

export const AdminToggleButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div>
      {isAdminPath ? (
        <Button variant="ghost" className="button button-dialog" onClick={() => navigate('/')}>
          <HomeIcon />
        </Button>
      ) : (
        <Button className="button button-dialog" onClick={() => navigate('/admin')}>
          <ShieldCheckIcon />
        </Button>
      )}
    </div>
  );
};
