import React from 'react';

import { Navigate } from 'react-router-dom';

export const NoAdminEntryRedirect: React.FC = () => {
  return null;
  return <Navigate to="/" replace />;
};
