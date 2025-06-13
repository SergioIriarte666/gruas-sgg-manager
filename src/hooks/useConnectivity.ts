
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());

  // Check basic network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check Supabase connectivity
  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const checkSupabaseConnection = async () => {
      if (!isOnline) {
        setIsSupabaseConnected(false);
        return;
      }

      try {
        // Simple query to test connection
        const { error } = await supabase
          .from('gruas')
          .select('id')
          .limit(1);
        
        if (mounted) {
          setIsSupabaseConnected(!error);
          setLastChecked(new Date());
        }
      } catch (error) {
        if (mounted) {
          setIsSupabaseConnected(false);
          setLastChecked(new Date());
        }
      }
    };

    // Initial check
    checkSupabaseConnection();

    // Check every 30 seconds
    intervalId = setInterval(checkSupabaseConnection, 30000);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline]);

  const retryConnection = () => {
    setLastChecked(new Date());
    // Trigger immediate connectivity check
    window.dispatchEvent(new Event('online'));
  };

  return {
    isOnline,
    isSupabaseConnected,
    isFullyConnected: isOnline && isSupabaseConnected,
    lastChecked,
    retryConnection
  };
}
