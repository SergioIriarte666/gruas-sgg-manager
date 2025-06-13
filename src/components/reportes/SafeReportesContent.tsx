
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ReportesLoadingSkeleton } from './ReportesLoadingSkeleton';
import { ReportesContent } from './ReportesContent';

// Check if React dispatcher is available
function isReactReady(): boolean {
  try {
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    return ReactInternals?.ReactCurrentDispatcher?.current !== null;
  } catch {
    return false;
  }
}

export function SafeReportesContent() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check periodically if React is ready
    const checkReady = () => {
      if (isReactReady()) {
        setIsReady(true);
      } else {
        // Try again in a few milliseconds
        setTimeout(checkReady, 10);
      }
    };

    checkReady();
  }, []);

  if (!isReady) {
    console.log('SafeReportesContent: React not ready, showing skeleton');
    return <ReportesLoadingSkeleton />;
  }

  try {
    return <ReportesContent />;
  } catch (error) {
    console.error('SafeReportesContent: Error rendering ReportesContent:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Error de Inicialización</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No se pudo inicializar correctamente el sistema de reportes
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }
}
