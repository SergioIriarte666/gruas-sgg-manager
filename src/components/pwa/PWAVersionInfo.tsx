
import React from 'react';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { cn } from '@/lib/utils';

interface PWAVersionInfoProps {
  className?: string;
  showIcon?: boolean;
}

export function PWAVersionInfo({ 
  className, 
  showIcon = true 
}: PWAVersionInfoProps) {
  const isEnabled = usePWAComponent('showVersionInfo');
  const { swVersion } = usePWA();

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
