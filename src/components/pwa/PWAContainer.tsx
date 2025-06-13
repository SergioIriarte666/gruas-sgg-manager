
import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { PWAUpdateButton } from './PWAUpdateButton';
import { PWAConnectionStatus } from './PWAConnectionStatus';
import { PWANotificationButton } from './PWANotificationButton';
import { PWAVersionInfo } from './PWAVersionInfo';
import { cn } from '@/lib/utils';

interface PWAContainerProps {
  layout?: 'horizontal' | 'vertical' | 'grid';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
  showText?: boolean;
}

export function PWAContainer({ 
  layout = 'horizontal', 
  spacing = 'normal', 
  className,
  showText = false
}: PWAContainerProps) {
  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-4'
  };

  const layoutClasses = {
    horizontal: 'flex flex-row items-center',
    vertical: 'flex flex-col items-start',
    grid: 'grid grid-cols-2 md:grid-cols-3'
  };

  return (
    <div className={cn(
      layoutClasses[layout],
      spacingClasses[spacing],
      className
    )}>
      <PWAInstallButton 
        variant="outline" 
        size={showText ? "default" : "sm"} 
        showText={showText} 
      />
      <PWAUpdateButton 
        variant="outline" 
        size={showText ? "default" : "sm"} 
        showText={showText} 
      />
      <PWAConnectionStatus showText={showText} />
      <PWANotificationButton 
        variant="outline" 
        size={showText ? "default" : "sm"} 
        showText={showText} 
      />
      <PWAVersionInfo showIcon={!showText} />
    </div>
  );
}
