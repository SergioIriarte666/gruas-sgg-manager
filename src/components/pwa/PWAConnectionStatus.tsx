
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { cn } from '@/lib/utils';

interface PWAConnectionStatusProps {
  showText?: boolean;
  className?: string;
}

export function PWAConnectionStatus({ 
  showText = true, 
  className 
}: PWAConnectionStatusProps) {
  const isEnabled = usePWAComponent('showConnectionStatus');
  const { isOnline } = usePWA();

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
