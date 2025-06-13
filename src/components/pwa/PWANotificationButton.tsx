
import React from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePWA';
import { usePWAComponent } from '@/contexts/PWAContext';
import { withReactReady } from '@/hooks/useSafeHooks';

interface PWANotificationButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

function PWANotificationButtonComponent({ 
  variant = 'outline', 
  size = 'default', 
  className, 
  showText = true 
}: PWANotificationButtonProps) {
  // Safe hook calls with error boundaries
  let isEnabled = false;
  let permission: NotificationPermission = 'default';
  let isSubscribed = false;
  let requestPermission = async () => false;
  let subscribe = async () => false;
  let unsubscribe = async () => false;
  let toastFn: any;

  try {
    isEnabled = usePWAComponent('showNotificationButton');
    const pushState = usePushNotifications();
    permission = pushState.permission;
    isSubscribed = pushState.isSubscribed;
    requestPermission = pushState.requestPermission;
    subscribe = pushState.subscribe;
    unsubscribe = pushState.unsubscribe;
    const { toast } = useToast();
    toastFn = toast;
  } catch (error) {
    console.error('Error in PWANotificationButton hooks:', error);
    // Return null if hooks fail to initialize
    return null;
  }

  if (!isEnabled) {
    return null;
  }

  const handleToggleNotifications = async () => {
    if (permission === 'denied') {
      if (toastFn) {
        toastFn({
          title: "Notificaciones bloqueadas",
          description: "Las notificaciones están bloqueadas. Puedes habilitarlas en la configuración del navegador.",
          variant: "destructive",
        });
      }
      return;
    }

    if (permission === 'default') {
      const granted = await requestPermission();
      if (!granted) {
        if (toastFn) {
          toastFn({
            title: "Permisos denegados",
            description: "No se pudieron obtener permisos para notificaciones.",
            variant: "destructive",
          });
        }
        return;
      }
    }

    if (isSubscribed) {
      const success = await unsubscribe();
      if (success && toastFn) {
        toastFn({
          title: "Notificaciones deshabilitadas",
          description: "Ya no recibirás notificaciones push.",
        });
      }
    } else {
      const success = await subscribe();
      if (success && toastFn) {
        toastFn({
          title: "Notificaciones habilitadas",
          description: "Recibirás notificaciones sobre actualizaciones y servicios.",
        });
      } else if (toastFn) {
        toastFn({
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

export const PWANotificationButton = withReactReady(PWANotificationButtonComponent);
