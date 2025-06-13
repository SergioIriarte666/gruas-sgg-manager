import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  canInstall: boolean;
  canUpdate: boolean;
  swVersion: string | null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Safe defaults for SSR/browser check
const getDefaultState = (): PWAState => ({
  isInstallable: false,
  isInstalled: false,
  isOnline: typeof window !== 'undefined' ? navigator?.onLine || false : false,
  hasUpdate: false,
  canInstall: false,
  canUpdate: false,
  swVersion: null,
});

export function usePWA() {
  // Browser check with early return
  if (typeof window === 'undefined') {
    return {
      ...getDefaultState(),
      installPWA: async () => false,
      updatePWA: async () => false,
      checkForUpdates: async () => false,
      cacheUrls: async () => false,
      getSWVersion: async () => {},
    };
  }

  const [state, setState] = useState<PWAState>(getDefaultState);

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Detectar si está instalado como PWA
  const detectPWAInstall = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isPWA = isStandalone || isInWebAppiOS;
    
    setState(prev => ({ ...prev, isInstalled: isPWA }));
  }, []);

  // Registrar Service Worker
  const registerSW = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        
        // Detectar actualizaciones
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, hasUpdate: true, canUpdate: true }));
              }
            });
          }
        });

        // Obtener versión del SW
        if (reg.active) {
          getSWVersion();
        }

        console.log('✅ Service Worker registrado exitosamente');
      } catch (error) {
        console.error('❌ Error registrando Service Worker:', error);
      }
    }
  }, []);

  // Obtener versión del Service Worker
  const getSWVersion = useCallback(async () => {
    if (registration?.active) {
      try {
        // Simular obtención de versión desde SW
        const version = '1.0.0'; // En un caso real, esto vendría del SW
        setState(prev => ({ ...prev, swVersion: version }));
      } catch (error) {
        console.error('Error obteniendo versión SW:', error);
      }
    }
  }, [registration]);

  // Instalar PWA
  const installPWA = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('No hay prompt de instalación disponible');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA instalada exitosamente');
        setState(prev => ({ ...prev, canInstall: false, isInstalled: true }));
        deferredPrompt = null;
        return true;
      } else {
        console.log('❌ Instalación de PWA cancelada');
        return false;
      }
    } catch (error) {
      console.error('Error instalando PWA:', error);
      return false;
    }
  }, []);

  // Actualizar PWA
  const updatePWA = useCallback(async (): Promise<boolean> => {
    if (!registration?.waiting) {
      console.warn('No hay actualización disponible');
      return false;
    }

    try {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Esperar a que el nuevo SW tome control
      await new Promise<void>((resolve) => {
        const handleControllerChange = () => {
          window.location.reload();
          resolve();
        };
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      });

      setState(prev => ({ ...prev, hasUpdate: false, canUpdate: false }));
      console.log('✅ PWA actualizada exitosamente');
      return true;
    } catch (error) {
      console.error('Error actualizando PWA:', error);
      return false;
    }
  }, [registration]);

  // Verificar actualizaciones
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    if (!registration) {
      console.warn('No hay Service Worker registrado');
      return false;
    }

    try {
      await registration.update();
      console.log('✅ Verificación de actualizaciones completada');
      return true;
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
      return false;
    }
  }, [registration]);

  // Cachear URLs específicas
  const cacheUrls = useCallback(async (urls: string[]): Promise<boolean> => {
    if (!('caches' in window)) {
      console.warn('Cache API no disponible');
      return false;
    }

    try {
      const cache = await caches.open('user-cache');
      await cache.addAll(urls);
      console.log('✅ URLs cacheadas exitosamente:', urls);
      return true;
    } catch (error) {
      console.error('Error cacheando URLs:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectar instalación PWA
    detectPWAInstall();

    // Registrar Service Worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          setRegistration(reg);
          
          // Detectar actualizaciones
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, hasUpdate: true, canUpdate: true }));
                }
              });
            }
          });

          console.log('✅ Service Worker registrado exitosamente');
        } catch (error) {
          console.error('❌ Error registrando Service Worker:', error);
        }
      }
    };

    registerSW();

    // Event listeners
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setState(prev => ({ ...prev, isInstallable: true, canInstall: true }));
      console.log('💡 PWA instalable detectada');
    };

    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      deferredPrompt = null;
      console.log('✅ PWA instalada');
    };

    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      console.log('🌐 Conexión restaurada');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      console.log('📡 Conexión perdida');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [detectPWAInstall]);

  return {
    ...state,
    installPWA: useCallback(async (): Promise<boolean> => {
      if (!deferredPrompt) {
        console.warn('No hay prompt de instalación disponible');
        return false;
      }

      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('✅ PWA instalada exitosamente');
          setState(prev => ({ ...prev, canInstall: false, isInstalled: true }));
          deferredPrompt = null;
          return true;
        } else {
          console.log('❌ Instalación de PWA cancelada');
          return false;
        }
      } catch (error) {
        console.error('Error instalando PWA:', error);
        return false;
      }
    }, []),
    updatePWA: useCallback(async (): Promise<boolean> => {
      if (!registration?.waiting) {
        console.warn('No hay actualización disponible');
        return false;
      }

      try {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        await new Promise<void>((resolve) => {
          const handleControllerChange = () => {
            window.location.reload();
            resolve();
          };
          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        });

        setState(prev => ({ ...prev, hasUpdate: false, canUpdate: false }));
        console.log('✅ PWA actualizada exitosamente');
        return true;
      } catch (error) {
        console.error('Error actualizando PWA:', error);
        return false;
      }
    }, [registration]),
    checkForUpdates: useCallback(async (): Promise<boolean> => {
      if (!registration) {
        console.warn('No hay Service Worker registrado');
        return false;
      }

      try {
        await registration.update();
        console.log('✅ Verificación de actualizaciones completada');
        return true;
      } catch (error) {
        console.error('Error verificando actualizaciones:', error);
        return false;
      }
    }, [registration]),
    cacheUrls: useCallback(async (urls: string[]): Promise<boolean> => {
      if (!('caches' in window)) {
        console.warn('Cache API no disponible');
        return false;
      }

      try {
        const cache = await caches.open('user-cache');
        await cache.addAll(urls);
        console.log('✅ URLs cacheadas exitosamente:', urls);
        return true;
      } catch (error) {
        console.error('Error cacheando URLs:', error);
        return false;
      }
    }, []),
    getSWVersion: useCallback(async () => {
      if (registration?.active) {
        try {
          const version = '1.0.0';
          setState(prev => ({ ...prev, swVersion: version }));
        } catch (error) {
          console.error('Error obteniendo versión SW:', error);
        }
      }
    }, [registration]),
  };
}

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsPWA(isStandalone || isInWebAppiOS);
  }, []);

  return isPWA;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Notificaciones no soportadas');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error solicitando permisos de notificación:', error);
      return false;
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications no soportadas');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY',
      });
      
      setSubscription(sub);
      console.log('✅ Suscripción push exitosa');
      return true;
    } catch (error) {
      console.error('Error suscribiendo push:', error);
      return false;
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      console.log('✅ Desuscripción push exitosa');
      return true;
    } catch (error) {
      console.error('Error desuscribiendo push:', error);
      return false;
    }
  }, [subscription]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  return {
    permission,
    subscription,
    isSubscribed: !!subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}
