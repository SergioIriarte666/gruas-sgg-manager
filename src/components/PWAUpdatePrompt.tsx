
import React, { useState, useEffect } from 'react';
import { X, Download, RefreshCw, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { usePWAConfig } from '@/contexts/PWAContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PWAUpdatePromptProps {
  position?: 'top' | 'bottom';
  autoShow?: boolean;
  className?: string;
}

export function PWAUpdatePrompt({ 
  position = 'bottom', 
  autoShow = true,
  className 
}: PWAUpdatePromptProps) {
  const { config } = usePWAConfig();
  const { canInstall, canUpdate, installPWA, updatePWA } = usePWA();
  const { toast } = useToast();
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-mostrar prompts según configuración
  useEffect(() => {
    if (!autoShow) return;

    // Prompt de actualización
    if (canUpdate && config.showUpdatePrompt) {
      setShowUpdatePrompt(true);
    }

    // Prompt de instalación con delay
    if (canInstall && config.autoPromptInstall && config.showInstallButton) {
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const now = Date.now();
      
      // No mostrar si se descartó en las últimas 24 horas
      if (!lastDismissed || now - parseInt(lastDismissed) > 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, config.installPromptDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [canInstall, canUpdate, config, autoShow]);

  const handleInstall = async () => {
    setIsLoading(true);
    const success = await installPWA();
    
    if (success) {
      setShowInstallPrompt(false);
      toast({
        title: "¡Aplicación instalada!",
        description: "SGG Grúa Manager se ha instalado correctamente.",
      });
    } else {
      toast({
        title: "Error de instalación",
        description: "No se pudo instalar la aplicación.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const success = await updatePWA();
    
    if (success) {
      setShowUpdatePrompt(false);
      toast({
        title: "¡Aplicación actualizada!",
        description: "La aplicación se ha actualizado correctamente.",
      });
    } else {
      toast({
        title: "Error de actualización",
        description: "No se pudo actualizar la aplicación.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  const positionClasses = {
    top: 'top-4 animate-slide-down',
    bottom: 'bottom-4 animate-slide-up'
  };

  // Prompt de actualización
  if (showUpdatePrompt) {
    return (
      <div className={cn(
        "fixed left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50",
        positionClasses[position],
        className
      )}>
        <Card className="shadow-lg border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Actualización Disponible</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismissUpdate}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Una nueva versión de la aplicación está disponible
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Actualizar Ahora
              </Button>
              <Button
                variant="outline"
                onClick={handleDismissUpdate}
                disabled={isLoading}
              >
                Después
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prompt de instalación
  if (showInstallPrompt) {
    return (
      <div className={cn(
        "fixed left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50",
        positionClasses[position],
        className
      )}>
        <Card className="shadow-lg border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Instalar Aplicación</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismissInstall}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Instala SGG Grúa Manager para un acceso más rápido y funciones offline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  ✓ Acceso offline
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ✓ Inicio rápido
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Download className="h-4 w-4 animate-bounce" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Instalar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismissInstall}
                  disabled={isLoading}
                >
                  No, gracias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
