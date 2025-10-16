import React from 'react';
import { Navigate } from 'react-router-dom';

export const NoAdminEntryRedirect: React.FC = () => {
  return <Navigate to="/" replace />;
};
