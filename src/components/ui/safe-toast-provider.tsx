
import React from 'react';
import { ToastProvider } from '@radix-ui/react-toast';

// Very strict React readiness check
function isReactDispatched(): boolean {
  try {
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    const dispatcher = ReactInternals?.ReactCurrentDispatcher?.current;
    
    // Ensure dispatcher exists and has required hooks
    return dispatcher !== null && 
           dispatcher !== undefined && 
           typeof dispatcher.useState === 'function' &&
           typeof dispatcher.useContext === 'function';
  } catch {
    return false;
  }
}

interface SafeToastProviderProps {
  children: React.ReactNode;
}

export function SafeToastProvider({ children }: SafeToastProviderProps) {
  // Immediate check without using any hooks
  if (!isReactDispatched()) {
    console.log('SafeToastProvider: React dispatcher not ready, rendering children without provider');
    return <>{children}</>;
  }

  try {
    return <ToastProvider>{children}</ToastProvider>;
  } catch (error) {
    console.error('SafeToastProvider: Error with ToastProvider:', error);
    return <>{children}</>;
  }
}
