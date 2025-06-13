
import { ErrorBoundary } from "react-error-boundary";
import { SafeReportesContent } from "@/components/reportes/SafeReportesContent";
import { Button } from "@/components/ui/button";

function ReportesErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  console.error('Reportes page error:', error);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error en el Sistema de Reportes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Se produjo un error al cargar el módulo de reportes. Esto puede deberse a un problema de inicialización del contexto.
          </p>
          <div className="space-y-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              Reintentar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Recargar Página
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reportes() {
  console.log('Reportes page: Rendering with safe components...');
  
  return (
    <ErrorBoundary
      FallbackComponent={ReportesErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Reportes ErrorBoundary caught:', error, errorInfo);
      }}
      onReset={() => {
        console.log('Reportes: Resetting error boundary');
      }}
    >
      <SafeReportesContent />
    </ErrorBoundary>
  );
}
