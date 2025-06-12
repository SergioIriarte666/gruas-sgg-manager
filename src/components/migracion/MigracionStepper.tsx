
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileUp, Eye, Play } from 'lucide-react';

interface Paso {
  numero: number;
  titulo: string;
  icono: React.ComponentType<{ className?: string }>;
  completado: boolean;
}

interface MigracionStepperProps {
  pasoActual: number;
  archivoCompleto: boolean;
  datosCompletos: boolean;
  validacionesCompletas: boolean;
  procesoCompletado: boolean;
}

export const MigracionStepper: React.FC<MigracionStepperProps> = ({
  pasoActual,
  archivoCompleto,
  datosCompletos,
  validacionesCompletas,
  procesoCompletado
}) => {
  const pasos: Paso[] = [
    { numero: 1, titulo: 'Preparación y Carga', icono: FileUp, completado: archivoCompleto },
    { numero: 2, titulo: 'Vista Previa y Mapeo', icono: Eye, completado: datosCompletos },
    { numero: 3, titulo: 'Validación de Datos', icono: CheckCircle, completado: validacionesCompletas },
    { numero: 4, titulo: 'Procesamiento', icono: Play, completado: procesoCompletado }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {pasos.map((paso, index) => {
            const Icon = paso.icono;
            const isActive = pasoActual === paso.numero;
            const isCompleted = paso.completado;
            
            return (
              <div key={paso.numero} className="flex items-center">
                <div className={`flex items-center gap-3 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-muted-foreground'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-medium">{paso.titulo}</div>
                    <div className="text-xs text-muted-foreground">Paso {paso.numero}</div>
                  </div>
                </div>
                {index < pasos.length - 1 && (
                  <div className="w-8 md:w-16 h-px bg-border mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
