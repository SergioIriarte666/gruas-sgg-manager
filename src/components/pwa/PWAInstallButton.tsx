
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { useReactReady } from '@/hooks/useSafeHooks';

interface PWAInstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function PWAInstallButton({ 
  variant = 'default', 
  size = 'default', 
  className, 
  showText = true 
}: PWAInstallButtonProps) {
  const isReactReady = useReactReady();
  
  // Don't render anything until React is ready
  if (!isReactReady) {
    return null;
  }

  // Safe hook calls with error boundaries
  let isEnabled = false;
  let canInstall = false;
  let installPWA = async () => false;
  let toastFn: any;

  try {
    isEnabled = usePWAComponent('showInstallButton');
    const pwaState = usePWA();
    canInstall = pwaState.canInstall;
    installPWA = pwaState.installPWA;
    const { toast } = useToast();
    toastFn = toast;
  } catch (error) {
    console.error('Error in PWAInstallButton hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

  if (!isEnabled || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    try {
      const success = await installPWA();
      
      if (success && toastFn) {
        toastFn({
          title: "¡Aplicación instalada!",
          description: "SGG Grúa Manager se ha instalado correctamente en tu dispositivo.",
        });
      } else if (toastFn) {
        toastFn({
          title: "Error de instalación",
          description: "No se pudo instalar la aplicación. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      if (toastFn) {
        toastFn({
          title: "Error de instalación",
          description: "No se pudo instalar la aplicación. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      className={className}
    >
      <Download className="h-4 w-4" />
      {showText && <span>Instalar App</span>}
    </Button>
  );
}
