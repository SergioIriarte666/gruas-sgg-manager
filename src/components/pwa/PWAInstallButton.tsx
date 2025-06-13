
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';

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
  // Safe hook calls with error boundaries
  let isEnabled = false;
  let pwaHookResult = null;
  let toastHook = null;

  try {
    isEnabled = usePWAComponent('showInstallButton');
    pwaHookResult = usePWA();
    toastHook = useToast();
  } catch (error) {
    console.error('Error in PWAInstallButton hooks:', error);
    return null;
  }

  const { canInstall, installPWA } = pwaHookResult || { canInstall: false, installPWA: async () => false };
  const { toast } = toastHook || { toast: () => {} };

  if (!isEnabled || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installPWA();
    
    if (success) {
      toast({
        title: "¡Aplicación instalada!",
        description: "SGG Grúa Manager se ha instalado correctamente en tu dispositivo.",
      });
    } else {
      toast({
        title: "Error de instalación",
        description: "No se pudo instalar la aplicación. Intenta nuevamente.",
        variant: "destructive",
      });
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
