
import { useEffect, useState } from 'react';

// Simple hook to check if React is ready
export function useReactReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady;
}

// Safe wrapper for any hook that might fail during initialization
export function useSafeHook<T>(hookFn: () => T, defaultValue: T): T {
  try {
    const isReady = useReactReady();
    if (!isReady) {
      return defaultValue;
    }
    return hookFn();
  } catch (error) {
    console.warn('Hook failed, using default value:', error);
    return defaultValue;
  }
}
