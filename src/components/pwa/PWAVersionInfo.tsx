
import React from 'react';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { withReactReady } from '@/hooks/useSafeHooks';
import { cn } from '@/lib/utils';

interface PWAVersionInfoProps {
  className?: string;
  showIcon?: boolean;
}

function PWAVersionInfoComponent({ 
  className, 
  showIcon = true 
}: PWAVersionInfoProps) {
  // Safe hook calls with error boundaries
  let isEnabled = false;
  let swVersion: string | null = null;

  try {
    isEnabled = usePWAComponent('showVersionInfo');
    const { swVersion: version } = usePWA();
    swVersion = version;
  } catch (error) {
    console.error('Error in PWAVersionInfo hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Badge 
      variant="outline"
      className={cn("flex items-center gap-1 text-xs", className)}
    >
      {showIcon && <Info className="h-3 w-3" />}
      <span>v{swVersion || '1.0.0'}</span>
    </Badge>
  );
}

export const PWAVersionInfo = withReactReady(PWAVersionInfoComponent);
