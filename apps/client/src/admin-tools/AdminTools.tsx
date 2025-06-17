import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useEffect, useState } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';
import { AdminToolbar } from 'admin-tools/AdminToolbar/AdminToolbar';

export const AdminTools = () => {
  const { isAdminToolsVisible } = useAdmin();
  const [_hasActiveTimer, setHasActiveTimer] = useState(false);

  // Check if there's an active config timer
  useEffect(() => {
    const checkActiveTimer = () => {
      const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
      if (!timestamp) {
        setHasActiveTimer(false);
        return;
      }

      const startTime = Number.parseInt(timestamp, 10);
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, CONFIG_EXPIRY_TIME_MS - elapsed);

      setHasActiveTimer(remaining > 0);
    };

    // Initial check
    checkActiveTimer();

    // Update every 5 seconds
    const intervalId = setInterval(checkActiveTimer, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <AdminToolbar />
    </>
  );
};
