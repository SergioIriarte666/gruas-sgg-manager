
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { cn } from '@/lib/utils';

interface PWAUpdateButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
  animate?: boolean;
}

export function PWAUpdateButton({ 
  variant = 'default', 
  size = 'default', 
  className, 
  showText = true,
  animate = true
}: PWAUpdateButtonProps) {
  // Safe hook calls with error boundaries
  let isEnabled = false;
  let canUpdate = false;
  let updatePWA = async () => false;
  let toastFn: any;

  try {
    isEnabled = usePWAComponent('showUpdatePrompt');
    const { canUpdate: canUpdateState, updatePWA: updatePWAFn } = usePWA();
    canUpdate = canUpdateState;
    updatePWA = updatePWAFn;
    const { toast } = useToast();
    toastFn = toast;
  } catch (error) {
    console.error('Error in PWAUpdateButton hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

  if (!isEnabled || !canUpdate) {
    return null;
  }

  const handleUpdate = async () => {
    try {
      const success = await updatePWA();
      
      if (success && toastFn) {
        toastFn({
          title: "¡Aplicación actualizada!",
          description: "La aplicación se ha actualizado a la última versión.",
        });
      } else if (toastFn) {
        toastFn({
          title: "Error de actualización",
          description: "No se pudo actualizar la aplicación. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during PWA update:', error);
      if (toastFn) {
        toastFn({
          title: "Error de actualización",
          description: "No se pudo actualizar la aplicación. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleUpdate}
      className={cn(
        className,
        animate && "animate-pulse"
      )}
    >
      <RefreshCw className="h-4 w-4" />
      {showText && <span>Actualizar</span>}
    </Button>
  );
}
