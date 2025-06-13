
import React from 'react';
import { ToastProvider } from '@radix-ui/react-toast';

// More robust React readiness check
function isReactFullyReady(): boolean {
  try {
    // Check multiple React internal states
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    const dispatcher = ReactInternals?.ReactCurrentDispatcher?.current;
    const batchedUpdates = ReactInternals?.ReactCurrentBatchConfig;
    
    // Ensure dispatcher and batching system are ready
    return dispatcher !== null && dispatcher !== undefined && batchedUpdates !== undefined;
  } catch {
    return false;
  }
}

interface SafeToastProviderProps {
  children: React.ReactNode;
}

export function SafeToastProvider({ children }: SafeToastProviderProps) {
  // Don't render anything if React isn't ready
  if (!isReactFullyReady()) {
    console.log('SafeToastProvider: React not fully ready, rendering children without provider');
    return <>{children}</>;
  }

  try {
    return <ToastProvider>{children}</ToastProvider>;
  } catch (error) {
    console.error('SafeToastProvider: Error rendering ToastProvider:', error);
    return <>{children}</>;
  }
}
