
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ContextErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('ContextErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Context error details:', error, errorInfo);
    
    // Special handling for React dispatcher errors
    if (error.message.includes('dispatcher') || error.message.includes('useState')) {
      console.error('React dispatcher error detected - this usually indicates a hook called outside component context');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-black text-primary">
            <div className="text-center max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Error de Inicialización</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Se produjo un error al inicializar la aplicación. Esto puede deberse a un problema de contexto de React.
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Recargar Aplicación
                </button>
                <button 
                  onClick={() => this.setState({ hasError: false })} 
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Intentar Nuevamente
                </button>
              </div>
              {this.state.error && (
                <details className="mt-4 text-xs text-left">
                  <summary className="cursor-pointer">Detalles del error</summary>
                  <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
