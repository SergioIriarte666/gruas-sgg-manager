
import React, { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

interface SafeTooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}

export function SafeTooltipProvider({ 
  children, 
  delayDuration = 700, 
  skipDelayDuration = 300 
}: SafeTooltipProviderProps) {
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
