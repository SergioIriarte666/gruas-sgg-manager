
import React from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';

interface PWANotificationButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function PWANotificationButton({ 
  variant = 'outline', 
  size = 'default', 
  className, 
  showText = true 
}: PWANotificationButtonProps) {
  const isEnabled = usePWAComponent('showNotificationButton');
  const { permission, isSubscribed, requestPermission, subscribe, unsubscribe } = usePushNotifications();
  const { toast } = useToast();

  if (!isEnabled) {
    return null;
  }

  const handleToggleNotifications = async () => {
    if (permission === 'denied') {
      toast({
        title: "Notificaciones bloqueadas",
        description: "Las notificaciones están bloqueadas. Puedes habilitarlas en la configuración del navegador.",
        variant: "destructive",
      });
      return;
    }

    if (permission === 'default') {
      const granted = await requestPermission();
      if (!granted) {
        toast({
          title: "Permisos denegados",
          description: "No se pudieron obtener permisos para notificaciones.",
          variant: "destructive",
        });
        return;
      }
    }

    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast({
          title: "Notificaciones deshabilitadas",
          description: "Ya no recibirás notificaciones push.",
        });
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast({
          title: "Notificaciones habilitadas",
          description: "Recibirás notificaciones sobre actualizaciones y servicios.",
        });
      } else {
        toast({
          title: "Error de suscripción",
          description: "No se pudo habilitar las notificaciones.",
          variant: "destructive",
        });
      }
    }
  };

  const getIcon = () => {
    if (permission === 'denied') return BellOff;
    if (isSubscribed) return BellRing;
    return Bell;
  };

  const Icon = getIcon();
  const isActive = permission === 'granted' && isSubscribed;

  return (
    <Button
      variant={isActive ? 'default' : variant}
      size={size}
      onClick={handleToggleNotifications}
      className={className}
      disabled={permission === 'denied'}
    >
      <Icon className="h-4 w-4" />
      {showText && (
        <span>
          {permission === 'denied' 
            ? 'Bloqueadas' 
            : isSubscribed 
              ? 'Activas' 
              : 'Notificaciones'
          }
        </span>
      )}
    </Button>
  );
}
