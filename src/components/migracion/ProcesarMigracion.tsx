
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProcesamientoEstadoCard } from './ProcesamientoEstado';
import { useMigracionProcessor } from '@/hooks/useMigracionProcessor';

interface ProcesarMigracionProps {
  datos: any[];
  headers?: string[];
  onVolver: () => void;
  onFinalizar: () => void;
}

export const ProcesarMigracion: React.FC<ProcesarMigracionProps> = ({
  datos,
  headers,
  onVolver,
  onFinalizar
}) => {
  const { toast } = useToast();
  const { estado, procesarMigracion, resetEstado } = useMigracionProcessor();

  const handleIniciarProcesamiento = async () => {
    try {
      await procesarMigracion(datos, headers);
      
      toast({
        title: "Migración completada",
        description: `Se procesaron ${datos.length} registros. ${estado.exitos} exitosos, ${estado.errores} errores.`,
      });
    } catch (error) {
      console.error('Error en migración:', error);
      toast({
        title: "Error en migración",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleFinalizar = () => {
    resetEstado();
    onFinalizar();
  };

  return (
    <div className="space-y-6">
      <ProcesamientoEstadoCard 
        estado={estado} 
        totalRegistros={datos.length} 
      />

      {/* Acciones */}
      <div className="flex gap-3">
        {!estado.iniciado && (
          <>
            <Button variant="outline" onClick={onVolver}>
              Volver a Validación
            </Button>
            <Button onClick={handleIniciarProcesamiento}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Procesamiento Real
            </Button>
          </>
        )}
        
        {estado.completado && (
          <Button onClick={handleFinalizar} className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar y Volver a Migraciones
          </Button>
        )}
      </div>

      {/* Mostrar errores detallados si los hay */}
      {estado.completado && estado.errores > 0 && (
        <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
          <h4 className="font-medium text-red-400 mb-2">Errores durante el procesamiento:</h4>
          <div className="space-y-1 text-sm text-muted-foreground max-h-40 overflow-y-auto">
            {estado.resultados
              .map((resultado, index) => ({ resultado, index }))
              .filter(({ resultado }) => !resultado.exito)
              .map(({ resultado, index }) => (
                <div key={index} className="text-red-300">
                  Registro {index + 1}: {resultado.error}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};
