
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProcesamientoEstadoCard } from './ProcesamientoEstado';

interface ProcesarMigracionProps {
  datos: any[];
  onVolver: () => void;
  onFinalizar: () => void;
}

interface ProcesamientoEstado {
  iniciado: boolean;
  completado: boolean;
  progreso: number;
  procesados: number;
  exitos: number;
  errores: number;
  registroActual?: string;
}

export const ProcesarMigracion: React.FC<ProcesarMigracionProps> = ({
  datos,
  onVolver,
  onFinalizar
}) => {
  const { toast } = useToast();
  const [estado, setEstado] = useState<ProcesamientoEstado>({
    iniciado: false,
    completado: false,
    progreso: 0,
    procesados: 0,
    exitos: 0,
    errores: 0
  });

  const simularProcesamiento = async () => {
    setEstado(prev => ({ ...prev, iniciado: true }));
    
    const total = datos.length;
    
    for (let i = 0; i < total; i++) {
      const registro = datos[i];
      const progreso = ((i + 1) / total) * 100;
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simular resultado aleatorio (90% éxito, 10% error)
      const esExito = Math.random() > 0.1;
      
      setEstado(prev => ({
        ...prev,
        progreso: Math.round(progreso),
        procesados: i + 1,
        exitos: prev.exitos + (esExito ? 1 : 0),
        errores: prev.errores + (esExito ? 0 : 1),
        registroActual: `${registro.marca_vehiculo || 'Registro'} ${registro.patente || i + 1}`
      }));
    }
    
    setEstado(prev => ({ ...prev, completado: true, registroActual: undefined }));
    
    toast({
      title: "Migración completada",
      description: `Se procesaron ${total} registros exitosamente`,
    });
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
            <Button onClick={simularProcesamiento}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Procesamiento
            </Button>
          </>
        )}
        
        {estado.completado && (
          <Button onClick={onFinalizar} className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar y Volver a Migraciones
          </Button>
        )}
      </div>
    </div>
  );
};
