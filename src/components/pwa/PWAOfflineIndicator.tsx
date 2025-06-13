
import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent, usePWAConfig } from '@/contexts/PWAContext';
import { withReactReady } from '@/hooks/useSafeHooks';
import { cn } from '@/lib/utils';

interface PWAOfflineIndicatorProps {
  className?: string;
  showIcon?: boolean;
}

function PWAOfflineIndicatorComponent({ 
  className, 
  showIcon = true 
}: PWAOfflineIndicatorProps) {
  // Safe hook calls with error boundaries
  let isEnabled = false;
  let isOnline = true;
  let config: any = {};

  try {
    isEnabled = usePWAComponent('showOfflineIndicator');
    const { config: pwaConfig } = usePWAConfig();
    const { isOnline: onlineState } = usePWA();
    config = pwaConfig;
    isOnline = onlineState;
  } catch (error) {
    console.error('Error in PWAOfflineIndicator hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

  if (!isEnabled || isOnline) {
    return null;
  }

  return (
    <Alert className={cn("border-orange-200 bg-orange-50", className)}>
      {showIcon && <WifiOff className="h-4 w-4 text-orange-600" />}
      <AlertDescription className="text-orange-700">
        <div className="flex items-center gap-2">
          {config.enableOfflineCache && (
            <Database className="h-4 w-4" />
          )}
          <span>
            {config.enableOfflineCache
              ? "Sin conexión - Funcionando en modo offline con datos locales"
              : "Sin conexión a internet - Algunas funciones pueden no estar disponibles"
            }
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export const PWAOfflineIndicator = withReactReady(PWAOfflineIndicatorComponent);
