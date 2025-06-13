
import React, { useState, useEffect } from 'react';

interface SafeAppWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function SafeAppWrapper({ children, fallback }: SafeAppWrapperProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("SafeAppWrapper: Initializing...");
    
    // Simple delay to ensure React is fully initialized
    const timer = setTimeout(() => {
      console.log("SafeAppWrapper: Ready!");
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default SafeAppWrapper;
