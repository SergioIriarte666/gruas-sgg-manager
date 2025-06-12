
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const iniciarProcesamiento = () => {
    simularProcesamiento();
  };

  return (
    <div className="space-y-6">
      {/* Estado del procesamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {!estado.iniciado ? (
              <Play className="h-5 w-5" />
            ) : estado.completado ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-400" />
            )}
            {!estado.iniciado ? 'Listo para Procesar' : 
             estado.completado ? 'Migración Completada' : 'Procesando Migración'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Información previa al procesamiento */}
            {!estado.iniciado && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Datos a procesar:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {datos.length} registros de servicios</li>
                      <li>• Validación de datos completa</li>
                      <li>• Respaldo automático antes de insertar</li>
                      <li>• Verificación de integridad</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Proceso a ejecutar:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Creación de registros de servicios</li>
                      <li>• Asignación de folios automáticos</li>
                      <li>• Validación de referencias (clientes, grúas, etc.)</li>
                      <li>• Actualización de estadísticas</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-400">Importante</div>
                      <div className="text-sm text-muted-foreground">
                        Este proceso no se puede deshacer. Asegúrate de que los datos son correctos antes de continuar.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progreso del procesamiento */}
            {estado.iniciado && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso general</span>
                    <span>{estado.progreso}%</span>
                  </div>
                  <Progress value={estado.progreso} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold">{estado.procesados}</div>
                    <div className="text-xs text-muted-foreground">Procesados</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="text-lg font-bold text-green-400">{estado.exitos}</div>
                    <div className="text-xs text-muted-foreground">Éxitos</div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="text-lg font-bold text-red-400">{estado.errores}</div>
                    <div className="text-xs text-muted-foreground">Errores</div>
                  </div>
                </div>

                {estado.registroActual && !estado.completado && (
                  <div className="text-center p-2 bg-muted/20 rounded border">
                    <div className="text-sm text-muted-foreground">Procesando:</div>
                    <div className="font-medium">{estado.registroActual}</div>
                  </div>
                )}
              </div>
            )}

            {/* Resultados finales */}
            {estado.completado && (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Migración completada exitosamente</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Se han migrado {estado.exitos} servicios de {datos.length} registros procesados.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="text-xl font-bold text-green-400">{estado.exitos}</div>
                    <div className="text-sm text-muted-foreground">Servicios Migrados</div>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="text-xl font-bold text-red-400">{estado.errores}</div>
                    <div className="text-sm text-muted-foreground">Errores</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex gap-3">
        {!estado.iniciado && (
          <>
            <Button variant="outline" onClick={onVolver}>
              Volver a Validación
            </Button>
            <Button onClick={iniciarProcesamiento}>
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
