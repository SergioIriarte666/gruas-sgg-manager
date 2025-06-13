
import { useEffect, useState } from 'react';

// Check if React dispatcher is available
function isReactReady(): boolean {
  try {
    // Try to access React's internal dispatcher
    const React = require('react');
    return React && React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current !== null;
  } catch {
    return false;
  }
}

// Simple hook to check if React is ready
export function useReactReady() {
  // Only call useState if React is ready
  if (!isReactReady()) {
    return false;
  }

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady;
}

// Safe wrapper for any hook that might fail during initialization
export function useSafeHook<T>(hookFn: () => T, defaultValue: T): T {
  if (!isReactReady()) {
    return defaultValue;
  }

  try {
    return hookFn();
  } catch (error) {
    console.warn('Hook failed, using default value:', error);
    return defaultValue;
  }
}

// Safe component wrapper that only renders when React is ready
export function withReactReady<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function SafeComponent(props: P) {
    if (!isReactReady()) {
      return null;
    }
    
    try {
      const isReady = useReactReady();
      if (!isReady) {
        return null;
      }
      return <Component {...props} />;
    } catch {
      return null;
    }
  };
}
