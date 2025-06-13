
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { withReactReady } from '@/hooks/useSafeHooks';
import { cn } from '@/lib/utils';

interface PWAConnectionStatusProps {
  showText?: boolean;
  className?: string;
}

function PWAConnectionStatusComponent({ 
  showText = true, 
  className 
}: PWAConnectionStatusProps) {
  // Safe hook calls with error boundaries
  let isEnabled = false;
  let isOnline = false;

  try {
    isEnabled = usePWAComponent('showConnectionStatus');
    const { isOnline: onlineState } = usePWA();
    isOnline = onlineState;
  } catch (error) {
    console.error('Error in PWAConnectionStatus hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Badge 
      variant={isOnline ? "default" : "destructive"}
      className={cn("flex items-center gap-1", className)}
    >
      {isOnline ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {showText && (
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      )}
    </Badge>
  );
}

export const PWAConnectionStatus = withReactReady(PWAConnectionStatusComponent);
