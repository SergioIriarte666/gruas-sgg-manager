
import React, { ReactNode, useState, useEffect } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

interface SafeTooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}

function isReactReady(): boolean {
  try {
    // Check if React's internal dispatcher is available
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    return ReactInternals?.ReactCurrentDispatcher?.current !== null;
  } catch {
    return false;
  }
}

export function SafeTooltipProvider({ 
  children, 
  delayDuration = 700, 
  skipDelayDuration = 300 
}: SafeTooltipProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if React is ready and set state accordingly
    if (isReactReady()) {
      setIsReady(true);
    }
  }, []);

  // If React dispatcher is not ready, just render children without tooltip context
  if (!isReactReady() || !isReady) {
    return <>{children}</>;
  }

  try {
    return (
      <TooltipProvider 
        delayDuration={delayDuration} 
        skipDelayDuration={skipDelayDuration}
      >
        {children}
      </TooltipProvider>
    );
  } catch (error) {
    console.warn('TooltipProvider failed to initialize, rendering children without tooltip context:', error);
    return <>{children}</>;
  }
}
