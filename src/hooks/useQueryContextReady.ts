
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useQueryContextReady() {
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10;

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkContext = () => {
      try {
        // Try to access QueryClient to verify context is ready
        const queryClient = useQueryClient();
        if (queryClient && mounted) {
          setIsReady(true);
          return;
        }
      } catch (error) {
        console.log('QueryClient not ready yet, retrying...', error);
      }

      if (retryCount < maxRetries && mounted) {
        timeoutId = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          checkContext();
        }, 100 * (retryCount + 1)); // Exponential backoff
      }
    };

    checkContext();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [retryCount, maxRetries]);

  return { isReady, retryCount, maxRetries };
}
