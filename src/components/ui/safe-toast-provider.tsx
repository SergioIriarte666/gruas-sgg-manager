
import React from 'react';
import { ToastProvider } from '@radix-ui/react-toast';

// Check if React dispatcher is available
function isReactReady(): boolean {
  try {
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    return ReactInternals?.ReactCurrentDispatcher?.current !== null;
  } catch {
    return false;
  }
}

interface SafeToastProviderProps {
  children: React.ReactNode;
}

export function SafeToastProvider({ children }: SafeToastProviderProps) {
  // Only render ToastProvider when React is ready
  if (!isReactReady()) {
    console.log('SafeToastProvider: React not ready, rendering children without provider');
    return <>{children}</>;
  }

  try {
    return <ToastProvider>{children}</ToastProvider>;
  } catch (error) {
    console.error('SafeToastProvider: Error rendering ToastProvider:', error);
    return <>{children}</>;
  }
}
