
import React, { useState, useEffect } from 'react';

interface SafeAppWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function SafeAppWrapper({ children, fallback }: SafeAppWrapperProps) {
  const [isReactReady, setIsReactReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    console.log("SafeAppWrapper: Checking React readiness...");
    
    try {
      // Verificar que React esté completamente inicializado
      const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (ReactInternals?.ReactCurrentDispatcher?.current) {
        console.log("SafeAppWrapper: React is ready!");
        setIsReactReady(true);
      } else {
        console.log("SafeAppWrapper: React dispatcher not ready, retrying...");
        // Retry after a short delay
        const timer = setTimeout(() => {
          setIsReactReady(true);
        }, 100);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("SafeAppWrapper: Error checking React readiness:", error);
      setInitError(error instanceof Error ? error.message : 'Unknown error');
      // Still try to render after a delay
      const timer = setTimeout(() => {
        setIsReactReady(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (initError) {
    console.log("SafeAppWrapper: Init error, but continuing...", initError);
  }

  if (!isReactReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Inicializando aplicación...</p>
          {initError && (
            <p className="text-sm text-muted-foreground mt-2">
              Advertencia: {initError}
            </p>
          )}
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error("SafeAppWrapper: Error rendering children:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-primary">
        <div className="text-center">
          <p>Error al cargar la aplicación</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      </div>
    );
  }
}

export default SafeAppWrapper;
